(() => {
    "use strict";
    const $ = id => document.getElementById(id);
    const api = window.KeroroDashboardConfig.apiBase;
    const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[ch]);
    const labels = {
        th: {title:"ค้นหาประวัติเหตุการณ์", intro:"เลือกช่วงวันเพื่อดูเหตุการณ์ที่เก็บไว้ตั้งแต่เริ่มบันทึก", from:"จากวันที่", to:"ถึงวันที่", search:"ค้นหา IP หรือสาเหตุ", submit:"ค้นหา", time:"เวลา", window:"ช่วงวิเคราะห์", reason:"สาเหตุ", severity:"ความเสี่ยง", prev:"ก่อนหน้า", next:"ถัดไป", initial:"เลือกช่วงวันแล้วกดค้นหา", empty:"ไม่พบเหตุการณ์ในช่วงนี้", error:"ค้นหาไม่สำเร็จ", range:"เลือกได้ครั้งละไม่เกิน 31 วัน", page:"รายการ", searchTitle:"ค้นหาสำเร็จ", searchDone:"พบข้อมูล {count} รายการ", errorTitle:"ดำเนินการไม่สำเร็จ", waitTitle:"กำลังดำเนินการ", waitMessage:"กรุณารอสักครู่ก่อนค้นหาอีกครั้ง", label:"ผลตรวจ", action:"จัดการ", review:"ตรวจสอบ", notReviewed:"ยังไม่ตรวจ", malicious:"เป็นภัยจริง", benign:"ปกติ / แจ้งเตือนผิด", labelTitle:"ตรวจสอบเหตุการณ์", labelReason:"เหตุผล (อย่างน้อย 8 ตัวอักษร)", saveLabel:"บันทึกผลตรวจสอบ", invalidLabel:"กรุณาเลือกผลและระบุเหตุผลอย่างน้อย 8 ตัวอักษร", labelSaved:"บันทึกผลตรวจสอบแล้ว"},
        en: {title:"Event history", intro:"Choose a date range to inspect retained security events", from:"From", to:"To", search:"Search IP or reason", submit:"Search", time:"Time", window:"Window", reason:"Detection", severity:"Severity", prev:"Previous", next:"Next", initial:"Choose a date range and search", empty:"No events in this range", error:"Search failed", range:"Choose at most 31 days per search", page:"Items", searchTitle:"Search complete", searchDone:"Found {count} items", errorTitle:"Action failed", waitTitle:"Action in progress", waitMessage:"Please wait before searching again", label:"Review", action:"Action", review:"Review", notReviewed:"Not reviewed", malicious:"Confirmed threat", benign:"Benign / false alert", labelTitle:"Review event", labelReason:"Reason (at least 8 characters)", saveLabel:"Save review", invalidLabel:"Choose a result and give a reason of at least 8 characters", labelSaved:"Review saved"}
    };
    const lang = () => (typeof language !== "undefined" && language === "en") ? "en" : "th";
    const t = key => labels[lang()][key];
    const fill = (key, values) => t(key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
    const notify = (type, title, message, key) => window.dashboardNotify?.show({type, title, message, key});
    const waitAction = key => window.dashboardNotify?.actions?.wait(key, {title:t("waitTitle"),message:t("waitMessage")});
    const beginAction = key => window.dashboardNotify?.actions?.begin(key) ?? true;
    const finishAction = (key,type,title,message) => window.dashboardNotify?.actions?.finish(key,{type,title,message});
    const state = {cursor:0, next:null, total:0, busy:false, searched:false, events:[], selected:null, labelVersion:0, session:null};
    function localDate(value) {const d=new Date(value);return Number.isNaN(d.valueOf())?"—":d.toLocaleString(lang()==="th"?"th-TH":"en-US");}
    function pageNumbers(current, total) {
        if (total <= 7) return Array.from({length: total}, (_, index) => index + 1);
        const pages = [1], start = Math.max(2, current - 1), end = Math.min(total - 1, current + 1);
        if (start > 2) pages.push("…");
        for (let page = start; page <= end; page++) pages.push(page);
        if (end < total - 1) pages.push("…");
        pages.push(total);
        return pages;
    }
    function renderPagination() {
        const limit = 20, totalPages = Math.max(1, Math.ceil(state.total / limit));
        const current = Math.min(totalPages, Math.floor(state.cursor / limit) + 1);
        const first = state.total ? state.cursor + 1 : 0, last = Math.min(state.cursor + limit, state.total);
        $("historyPageSummary").textContent = `${t("page")} ${first}–${last} / ${state.total}`;
        $("historyPaginationButtons").innerHTML = [
            `<button class="page-btn" type="button" data-page-action="prev" ${current === 1 ? "disabled" : ""}>${escapeHtml(t("prev"))}</button>`,
            ...pageNumbers(current, totalPages).map(page => page === "…" ? `<span class="page-ellipsis">…</span>` : `<button class="page-btn ${page === current ? "active" : ""}" type="button" data-page="${page}" ${page === current ? "aria-current=\"page\"" : ""}>${page}</button>`),
            `<button class="page-btn" type="button" data-page-action="next" ${current === totalPages || state.next === null ? "disabled" : ""}>${escapeHtml(t("next"))}</button>`,
        ].join("");
    }
    function applyText() {
        const ids = {historyTitle:"title",historyIntro:"intro",historyFromLabel:"from",historyToLabel:"to",historySearchLabel:"search",historySubmit:"submit",historyThTime:"time",historyThWindow:"window",historyThReason:"reason",historyThSeverity:"severity",historyThLabel:"label",historyThAction:"action",eventLabelTitle:"labelTitle",eventLabelReasonLabel:"labelReason",eventLabelSubmit:"saveLabel"};
        for (const [id,key] of Object.entries(ids)) $(id).textContent=t(key);
        $("eventLabelSelectLabel").textContent=t("label");
        $("eventLabelSelect").options[0].textContent=t("malicious");
        $("eventLabelSelect").options[1].textContent=t("benign");
        if (!state.searched) $("historyRows").innerHTML=`<tr><td colspan="7">${escapeHtml(t("initial"))}</td></tr>`;
        else renderPagination();
    }
    async function search(feedback = false) {
        if (state.busy) {if(feedback)waitAction("history-search");return;}
        const start=$("historyFrom").value, end=$("historyTo").value;
        const days=(Date.parse(end+"T00:00:00Z")-Date.parse(start+"T00:00:00Z"))/86400000;
        if (!start || !end || days<0 || days>30) {notify("error",t("errorTitle"),t("range"),"history-search");return;}
        if(feedback&&!beginAction("history-search")){waitAction("history-search");return;}
        state.busy=true;
        if (feedback) window.dashboardButtonBusy?.($("historySubmit"), true);
        try {
            const params=new URLSearchParams({from:start,to:end,search:$("historySearch").value.trim(),cursor:state.cursor,limit:20});
            const response=await fetch(`${api}/events?${params}`,{credentials:"same-origin",cache:"no-store"});
            const data=await response.json();
            if (!response.ok) throw new Error(data.error||`HTTP ${response.status}`);
            state.searched=true;state.total=data.total;state.next=data.next_cursor;state.events=data.items;
            $("historyRows").innerHTML=data.items.length?data.items.map(item=>`<tr>
                <td title="${escapeHtml(item.time||item.minute||"")}">${escapeHtml(localDate(item.time||`${item.minute}:00Z`))}</td>
                <td><code>${escapeHtml(item.ip)}</code></td><td>${escapeHtml(item.window_minutes||1)} min</td>
                <td>${escapeHtml((item.reasons||[]).join(", ")||"AI_ANOMALY")}</td>
                <td>${escapeHtml(item.severity)}</td>
                <td>${escapeHtml(item.analyst_label==="MALICIOUS"?t("malicious"):item.analyst_label==="BENIGN"?t("benign"):t("notReviewed"))}</td>
                <td><button class="enforcement-view" type="button" data-event-id="${escapeHtml(item.event_id)}">${escapeHtml(t("review"))}</button></td></tr>`).join(""):`<tr><td colspan="7">${escapeHtml(t("empty"))}</td></tr>`;
            renderPagination();
            if (feedback) finishAction("history-search","success",t("searchTitle"),fill("searchDone",{count:data.total}));
        } catch(error) {if(feedback)finishAction("history-search","error",t("errorTitle"),`${t("error")}: ${error.message}`);else notify("error",t("errorTitle"),`${t("error")}: ${error.message}`,"history-search");}
        finally {state.busy=false;if(feedback)window.dashboardButtonBusy?.($("historySubmit"),false);}
    }
    async function openReview(id) {
        const item=state.events.find(event=>event.event_id===id);
        if(!item)return;
        state.selected=item;
        $("eventLabelTitle").textContent=t("labelTitle");
        $("eventLabelDetail").textContent=`${item.ip} · ${localDate(item.time||`${item.minute}:00Z`)} · ${(item.reasons||[]).join(", ")||"AI_ANOMALY"}`;
        $("eventLabelError").textContent="";
        try {
            const [sessionResponse,labelResponse]=await Promise.all([
                fetch(`${api}/session`,{credentials:"same-origin",cache:"no-store"}),
                fetch(`${api}/events/${encodeURIComponent(id)}/label`,{credentials:"same-origin",cache:"no-store"})
            ]);
            if(!sessionResponse.ok||!labelResponse.ok)throw new Error("HTTP error");
            state.session=await sessionResponse.json();
            const labelData=await labelResponse.json();
            state.labelVersion=labelData.label?.version||0;
            $("eventLabelSelect").value=labelData.label?.label||"MALICIOUS";
            $("eventLabelReason").value="";
            $("eventLabelForm").hidden=!state.session.can_unblock;
            $("eventLabelDialog").showModal();
        } catch(error) {notify("error",t("errorTitle"),`${t("error")}: ${error.message}`,"history-review");}
    }
    async function saveReview() {
        const item=state.selected, reason=$("eventLabelReason").value.trim();
        if(!item||reason.length<8||reason.length>500){$("eventLabelError").textContent=t("invalidLabel");return;}
        const button=$("eventLabelSubmit");button.disabled=true;
        try {
            const response=await fetch(`${api}/events/${encodeURIComponent(item.event_id)}/label`,{
                method:"POST",credentials:"same-origin",
                headers:{"Content-Type":"application/json","X-CSRF-Token":state.session?.csrf_token||""},
                body:JSON.stringify({label:$("eventLabelSelect").value,reason,event_date:item.minute.slice(0,10),expected_version:state.labelVersion})
            });
            const result=await response.json();
            if(!response.ok)throw new Error(result.error||`HTTP ${response.status}`);
            $("eventLabelDialog").close();
            notify("success",t("searchTitle"),t("labelSaved"),"history-review");
            await search();
        } catch(error) {$("eventLabelError").textContent=`${t("error")}: ${error.message}`;}
        finally {button.disabled=false;}
    }
    const today=new Date();
    const dateValue=days=>{const d=new Date(today);d.setDate(d.getDate()-days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
    $("historyTo").value=dateValue(0);$("historyFrom").value=dateValue(7);
    $("historySubmit").addEventListener("click",()=>{state.cursor=0;search(true);});
    $("historyPaginationButtons").addEventListener("click",event=>{
        const button=event.target.closest("button[data-page-action], button[data-page]");
        if(!button||button.disabled)return;
        if(button.dataset.pageAction==="prev")state.cursor=Math.max(0,state.cursor-20);
        else if(button.dataset.pageAction==="next")state.cursor+=20;
        else state.cursor=(Number(button.dataset.page)-1)*20;
        search();
    });
    $("historyRows").addEventListener("click",event=>{const button=event.target.closest("button[data-event-id]");if(button)openReview(button.dataset.eventId);});
    $("eventLabelSubmit").addEventListener("click",saveReview);
    for(const id of ["thBtn","enBtn"]) $(id).addEventListener("click",()=>setTimeout(applyText,0));
    applyText();
})();
