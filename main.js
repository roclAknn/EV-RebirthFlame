// 出力中のデータキャッシュ
const exportData = {
  input: null,
  panes: [
    [/*{scoreKey, rowIdx, score, prob}*/],
    [/*{scoreKey, rowIdx, score, prob}*/],
  ],
  topnumMaps: [],
};

// cookieがない、取得できない場合などの既定値
const defaultValues = {
  "input-isarmor": "true",
  "input-eqplv": "200", "input-min": "100",
  "input-isboss": "true",
  "input-issimpleatk": "true", "input-simpleatk": "5", "input-weaponatk": "400",
  "input-str": "1",  "input-dex": "0.1", "input-int": "", "input-luk": "",
  "input-all": "10", "input-atk": "3",   "input-hp": "",  "input-dam": "11",
};

// クッキー保存する入力値IDリスト
const cookieTargets = Object.keys(defaultValues);

// document.get～のキャッシュ　getterは直接定義
const els = {
  get eqptypeSelected(){
    return document.querySelector(".eqptype-button.selected");
  },
};

function initialize(){
  initializeUI();

  const headerLinkEntries = [
    ["GitHub(使い方)", "https://github.com/roclAknn/EV-RebirthFlame"],
    ["キューブ計算器", "https://roclaknn.github.io/EV-Cube-Calculator/"],
    ["ステータス効率計算器", "https://roclaknn.github.io/MapleStory-StatusCalc/"],
  ];
  buildHeader("/MapleStory/ 転生の炎の確率計算器", headerLinkEntries);
}


function initializeUI(){
  Object.assign(els, {
    main: document.querySelector("main"),
    maindiv: document.querySelector("#maindiv"),
    headerrow: document.querySelector("#header-row"),
    conditionrow: document.querySelector("#condition-row"),
    exportrow: document.querySelector("#export-row"),

    maincolumn: document.querySelector("#main-column"),
    subcolumn: document.querySelector("#sub-column"),
    eqptypeButtons: {
      武器: document.querySelector(".eqptype-weapon"),
      防具: document.querySelector(".eqptype-armor")
    },
    statustable: document.querySelector("#status-table"),
    statuslabels: [],
    statusinputs: [],
    input: {
      isarmor: document.querySelector("#input-isarmor"),
      eqplv: document.querySelector("#input-eqplv"),
      min: document.querySelector("#input-min"),
      isboss: document.querySelector("#input-isboss"),
      issimpleatk: document.querySelector("#input-issimpleatk"),
      simpleatk: document.querySelector("#input-simpleatk"),
      weaponatk: document.querySelector("#input-weaponatk"),
      statustemplate: document.querySelector("#status-template"),
      statuses: null, /* statusinputs */
    },
    opener: document.querySelector("#condition-row .opener"),
    condition: {
      eqptype: document.querySelector("#condition-eqptype"),
      eqptypeText: document.querySelector("#condition-eqptype-text"),
    },
    export: {
      export: document.querySelector("#export-button"),
      numinput: document.querySelector("#export-numinput"),
      typediv: document.querySelector("#export-typediv"),
      type: document.querySelector("#export-type"),
    },
    alignpanesdiv: document.querySelector("#align-panesdiv"),
    alignpanes: document.querySelector("#align-panes"),
    scrollButtons: null,
    pane: {
      columns: [],
      tenseis: [],
      eqplvs: [],
      tenseiinputs: [],
      eqplvinputs: [],
      bodycontainers: [],
      bodys: [],
    }
  });
  els.input.statuses = els.statusinputs;

  {// statusinput の作成
    const fragment = document.createDocumentFragment();
    const ROWS_NUM = 4;
    for (let i = 0; i < ROWS_NUM; i++){
      for (let ii = 0; ii < 2; ii++){
        const idx = i + ii * ROWS_NUM;
        const labeldiv = document.createElement("div");
        const inputdiv = document.createElement("div");
        labeldiv.dataset.idx
        = inputdiv.dataset.idx
        = String(idx);
        labeldiv.className = `cell label`;
        inputdiv.className = `cell input`;
        fragment.appendChild(labeldiv);
        fragment.appendChild(inputdiv);
        els.statuslabels[idx] = labeldiv;
        els.statusinputs[idx] = inputdiv;
      }
    }
    els.statustable.appendChild(fragment);
  }
  {// export-typeの作成
    const namelist = 出力タイプ名リスト;
    const fragment = document.createDocumentFragment();
    namelist.forEach( name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.label = 出力タイプ名テキスト[name];
      fragment.appendChild(opt);
    });
    const typesel = els.export.type;
    typesel.appendChild(fragment);
    typesel.selectedIndex = 0;
  }
  {// export-rowの中身を作成
    const TENSEI_PANE_NUMS = 2;
    for (let i = 0; i < TENSEI_PANE_NUMS; i++){
      const idx = i;
      const tenseibtn = document.createElement("button");
      const tenseisel = document.createElement("ul");
      tenseibtn.className = `tensei-button`;
      tenseisel.className = `tensei-select pane-select`;
      tenseisel.dataset.paneIndex = idx;
      const tenseiinput = document.createElement("input");
      Object.assign(tenseiinput, {
        className: "tensei-input",
        hidden: true,
      });
      tenseisel.appendChild(tenseiinput);
      {// 転生の炎選択ボックスを作成
        const button = tenseibtn;
        const select = tenseisel;
        const buttonIcon = document.createElement("img");
        const buttonText = document.createElement("span");
        button.appendChild(buttonIcon);
        button.appendChild(buttonText);
        button.addEventListener("click", ()=>{
          if (isExporting) return;
          PullDownControl.showPulldown(button, select);
        });
        select.hidden = true;
        転生セレクト.forEach( (key, optidx) => {
          const text = 転生セレクト名リスト[key];
          const opt = document.createElement("li");
          const iconsrc = `./images/${転生アイコン名リスト[key]}.png`
          opt.innerHTML = `
            <img src="${iconsrc}">
            ${text.length <= 10 ? text : (text.slice(0, 8) + "...")}
          `;
          if (8 < text.length) opt.title = text;
          // 永遠転生と強力転生をデフォルトにする
          if ( idx === optidx - 1 ){
            opt.classList.add("selected");
            buttonIcon.src = iconsrc;
            buttonText.innerHTML = key; // 短縮表示
            tenseiinput.value = key;
          }
          opt.addEventListener("click", ()=>{
            PullDownControl.hideActivePulldown();
            if ( opt.classList.contains("selected") ) return;
            select.querySelector(".selected")?.classList.remove("selected");
            opt.classList.add("selected");
            buttonIcon.src = iconsrc;
            buttonText.innerHTML = key; // 短縮表示
            tenseiinput.value = key;
            exportPane(idx);
          });
          select.appendChild(opt);
        });
      }
      const eqplvbtn = document.createElement("button");
      const eqplvsel = document.createElement("ul");
      eqplvbtn.className = `eqplv-button`;
      eqplvsel.className = `eqplv-select pane-select`;
      eqplvsel.dataset.paneIndex = idx;
      const eqplvinput = document.createElement("input");
      Object.assign(eqplvinput, {
        type: "number",
        placeholder: "装備レベル",
        className: "eqplv-input",
        min: 0, max: 300,
      });
      eqplvsel.appendChild(eqplvinput);
      {// レベル選択ボックスを作成
        eqplvinput.oninput = ()=>{
          let eqplv = getValue(eqplvinput) ?? 0;
          eqplv = eqplv < 0 ? 0 : ~~eqplv;
          buttonText.textContent = eqplv;
          select.querySelector(".selected")?.classList.remove("selected");
          select.querySelector(`li[data-value="${eqplv}"]`)?.classList.add("selected");
        };
        const button = eqplvbtn;
        const select = eqplvsel;
        const buttonText = document.createElement("span");
        button.append("Lv.");
        button.appendChild(buttonText);
        button.addEventListener("click", ()=>{
          if (isExporting) return;
          PullDownControl.showPulldown(button, select);
        });
        select.hidden = true;
        レベルセレクト.forEach( (key, optidx) => {
          const text = レベルセレクト名リスト[key];
          const opt = document.createElement("li");
          opt.innerHTML = `
            ${text}
          `;
          opt.dataset.value = text;
          // 200をデフォルトにする
          if ( optidx === 1 ){
            opt.classList.add("selected");
            buttonText.innerHTML = text;
            eqplvinput.value = key;
          }
          opt.addEventListener("click", ()=>{
            PullDownControl.hideActivePulldown();
            if ( opt.classList.contains("selected") ) return;
            select.querySelector(".selected")?.classList.remove("selected");
            opt.classList.add("selected");
            buttonText.innerHTML = text;
            eqplvinput.value = key;
            opt.dataset.value = key;
            exportPane(idx);
          });
          select.appendChild(opt);
        });
      }
      

      
      const column = document.createElement("div");
      column.id = `pane-${idx}`;
      column.className = `pane`;
      column.innerHTML = `
        <div id="pane-title-${idx}" class="pane-title">
          <div id="tensei-container-${idx}" class="tensei-container">
          </div>
          <div id="eqplv-container-${idx}" class="eqplv-container">
          </div>
        </div>
        <div class="pane-body-container">
          <div id="pane-body-${idx}" class="pane-body"></div>
        </div>
      `;

      const tenseidiv = column.querySelector(`#tensei-container-${idx}`);
      const eqplvdiv = column.querySelector(`#eqplv-container-${idx}`);
      tenseidiv.addEventListener("click", e => e.stopPropagation() );
      eqplvdiv.addEventListener("click", e => e.stopPropagation() );
      tenseidiv.append(tenseibtn, tenseisel);
      eqplvdiv.append(eqplvbtn, eqplvsel);
      els.exportrow.appendChild(column);
      els.pane.columns[idx] = column;
      els.pane.tenseis[idx] = tenseidiv;
      els.pane.tenseiinputs[idx] = tenseiinput;
      els.pane.eqplvs[idx] = tenseidiv;
      els.pane.eqplvinputs[idx] = eqplvinput;
      els.pane.bodycontainers[idx] = column.querySelector(`.pane-body-container`);
      els.pane.bodys[idx] = column.querySelector(`.pane-body`);
    };
  }
  {// スクロールボタンを作成
    const container = document.createElement("div");
    container.className = "main-scroll-controls";
    container.innerHTML = `
      <button type="button" class="main-scroll-button scroll-top" aria-label="一番上へスクロール">▲</button>
      <button type="button" class="main-scroll-button scroll-bottom" aria-label="一番下へスクロール">▼</button>
    `;
    els.main.appendChild(container);
    els.scrollButtons = {
      container,
      top: container.querySelector(".scroll-top"),
      bottom: container.querySelector(".scroll-bottom"),
    };
  }
  /* ------------------------------------------------ */
  {// クッキーから復元（ない場合は初期値）
    cookieTargets.forEach( id => {
      const el = document.getElementById(id);
      if (!el) return;
      // valは文字列
      const val = getCookie(id) ?? defaultValues[id] ?? null;
      console.log(id, val, el)
      const tagName = el.tagName.toLocaleLowerCase();
      const type = el.type.toLocaleLowerCase();
      if(tagName === "input"){
        if (type === "checkbox"){
          el.checked = val === "true"; return;
        }
        // inputtext
        el.value = val ?? "";
      }
      // select
      if (val === null){
        el.selectedIndex = 0; return;
      }
      el.value = val;
    }); 
  }
  /* --------------------------------------------------- */
  {//イベントリスナーの登録
    document.querySelectorAll(".eqptype-button").forEach(btn => {
      btn.addEventListener("click", () => {
        const input = els.input.isarmor;
        input.checked = btn.dataset.type === "防具";
        update();
      });
    });
    document.querySelectorAll("#main-column .divbutton").forEach(btn => {
      btn.addEventListener("click", () => {
        const input = document.querySelector(btn.dataset.input);
        input.checked = !input.checked;
        update();
      });
    });
    els.input.eqplv.oninput = ()=>{
      initSimpleAtk();
    };
    els.opener.addEventListener("click", ()=>{
      els.maindiv.classList.toggle("isclosed");
    });
    els.export.export.addEventListener("click", ()=>{
      exportAllPane();
    });
    els.export.numinput.oninput = ()=>{
      buildPaneBody(0);
      buildPaneBody(1);
    };
    els.export.typediv.addEventListener("click", ()=>{
      const typesel = els.export.type;
      typesel.selectedIndex = (typesel.selectedIndex + 1) % typesel.options.length;
      update();
      buildPaneBody(0);
      buildPaneBody(1);
    });
    els.alignpanesdiv.addEventListener("click", ()=>{
      const sel = els.alignpanes;
      sel.selectedIndex = (sel.selectedIndex + 1) % sel.options.length;
      update();
      updatePaneAlignment(true);
    });
    els.scrollButtons.top.addEventListener("click", ()=>{
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    els.scrollButtons.bottom.addEventListener("click", ()=>{
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
    });
  }

  {// 初期値の反映
    // アニメーションのための既定の高さセット
    els.headerrow.style.height
     = els.maincolumn.style.height
     = els.subcolumn.style.height = els.headerrow.offsetHeight + "px";
    update();
    updateStatusTable();
  }
}


// プルダウン開閉制御の静的クラス
class PullDownControl {
  static _activePulldown = null;
  static _activeOpener = null;
  static hideActivePulldown() {
    if (!this._activePulldown) return;
    const active = this._activePulldown;
    active.hidden = true;
    this._activePulldown = null;
  }
  static showPulldown(opener, select) {
    const active = this._activePulldown;
    const isTargetShown = (select === active);
    this.hideActivePulldown();
    if (isTargetShown) return; // ターゲットがすでに開いていたら閉じるだけ
    this._activeOpener = opener;
    this._activePulldown = select;
    select.hidden = false;
  }
}
document.addEventListener("click", ()=>{
  const active = PullDownControl._activePulldown;
  PullDownControl.hideActivePulldown();
  if (active && active.classList.contains("pane-select")){
    exportPane(+active.dataset.paneIndex);
  }
});


function update(){
  updateEquipType();
  
  {
    const divbuttons = document.querySelectorAll("#main-column .divbutton");
    divbuttons.forEach(btn => {
      const input = document.querySelector(btn.dataset.input);
      const stat = input.checked;
      const cln = btn.dataset.togglecln;
      btn.classList.toggle("active", stat);
      if (cln) els.maindiv.classList.toggle(cln, stat);
    });
  }
  {
    const exporttype = els.export.type;
    const selopt = exporttype.selectedOptions[0];
    els.export.typediv.textContent = selopt.label;
    els.export.numinput.disabled = !( "prob" === selopt.value.slice(0, 4) );
  }
  {
    const mode = els.alignpanes.value;
    const titles = { none: "並び替えなし", score: "スコア順", prob: "確率順" };
    els.alignpanesdiv.classList.toggle("accepted", mode !== "none");
    els.alignpanesdiv.dataset.mode = mode;
    els.alignpanesdiv.title = titles[mode] ?? titles.none;
    const label = els.alignpanesdiv.querySelector(".align-mode-label");
    if (label) label.textContent = mode === "score" ? "S" : mode === "prob" ? "P" : "";
  }
  initSimpleAtk();
  // updateStatusTable();
}

function updateEquipType(){
  const isArmor = els.input.isarmor.checked;
  els.maindiv.classList.toggle("isarmorselected", isArmor);

  const type = isArmor ? "防具" : "武器";
  const selected = els.eqptypeSelected;
  const target = els.eqptypeButtons[type];
  if (target === selected) return;

  selected.classList.remove("selected");
  target.classList.add("selected");
  updateStatusTable();
}

function updateStatusTable(){
  const isArmor = els.input.isarmor.checked;
  const type = isArmor ? "防具" : "武器";

  const namelist = スコアフォーム名リスト[type];
  const labels = els.statuslabels;
  const inputs = els.statusinputs;
  // 入力値をcookieに保存（ページ表示時は空）
  const values = getInputsWithSetCookie("onlyStatus");

  //要素の切り替え(cookieから復元)
  labels.forEach((label, idx)=>{
    const input = inputs[idx];
    const name = namelist[idx];
    const labelname = スコアフォーム名テキスト[name] ?? "";
    if (labelname === ""){
      label.innerHTML = "";
      input.innerHTML = "";
      return;
    }
    const id = `input-${name}`;
    const inputval = getCookie(id) ?? defaultValues[id] ?? "";
    label.innerHTML = `<label for="${id}">${labelname}</label>`;
    input.innerHTML = `<input value="${inputval}" id="${id}" class="input-status" type="number" step="any">`;
    if (input.oninput) input.oninput(); // 整合性チェック
  });
}

function initSimpleAtk(){
  const {eqplv, simpleatk}  = els.input;
  const ranks = [5,4,3,2,1,0];
  
  let lv = Math.max(0, getValue(eqplv) ?? 0);
  let isboss = els.input.isboss.checked;
  // 転生基準値リストに含まれる数値に丸める
  const baselist = 転生基準値リスト.武器;
  for(let i = baselist.length; i--;){
    const lv2 = baselist[i][0];
    if(lv < lv2) continue;
    lv = lv2;
    break;
  }
  
  const templateOption = document.createElement('option');
  const fragment = document.createDocumentFragment();
  ranks.forEach((rank, i) => {
    //オプションは配置済みなら再利用
    let optionElement = simpleatk.options[i];
    if( !optionElement ){
      optionElement = templateOption.cloneNode(true);
      fragment.appendChild(optionElement);
    }
    
    optionElement.value = rank; //値はボスボーナスを乗せない
    if( rank == 0 ){
      optionElement.label = "全出力";
    }else{
      let atktensei = getAtkTensei(lv, rank, isboss);
      optionElement.label = `R${ rank + (isboss ? 2 : 0) } (${ atktensei.toFixed(1) }%)`;
    }
  });

  simpleatk.appendChild(fragment);
  const id = simpleatk.id;
  simpleatk.value = getCookie(id) ?? defaultValues[id] ?? 0;
}

const PANE_HEADER_HEIGHT = 28;
const PANE_ROW_HEIGHT = 25;

function buildMergedRows(panes, issimpleatk, mode){
  const isScoreMode = mode === "score";
  if (isScoreMode){
    const scoreMap = new Map();
    panes.forEach((panedata, paneIdx) => {
      panedata.forEach(entry => {
        if (!scoreMap.has(entry.scoreKey)){
          scoreMap.set(entry.scoreKey, [null, null]);
        }
        scoreMap.get(entry.scoreKey)[paneIdx] = entry;
      });
    });
    return [...scoreMap.keys()]
      .sort((a, b) => {
        const grank = (key) => +(/^R(\d+)/.exec(key)?.[1] ?? 0);
        const gscore = (key) => +(/\d+$/.exec(key)?.[0] ?? 0);
        if (issimpleatk)
          return (grank(a) - grank(b)) || (gscore(a) - gscore(b));
        return gscore(a) - gscore(b);
      })
      .map(key => scoreMap.get(key));
  } else { // isProbMode
    const result = new Array();
    const pane0 = panes[0], pane1 = panes[1];
    let p0 = 0, p1 = 0;
    while(1){
      const prob0 = pane0[p0]?.probKey ?? null;
      const prob1 = pane1[p1]?.probKey ?? null;
      let res;
      if (prob0 === null){
        if (prob1 === null) break;
        res = 1;
      } else if (prob1 === null){
        res = -1;
      } else {
        res = prob0.lte(prob1) ? -1 : 1;
        let diff = prob0.minus(prob1).abs();
        if ( (res < 0 ? prob0 : prob1).div(100).gte(diff)) res = 0; // 差が小さければ同値扱い
      }
      const probs = [null, null];
      if (res <= 0) probs[0] = pane0[p0++];
      if (0 <= res) probs[1] = pane1[p1++];
      result.push(probs);
    }
    return result;
  }
}

function captureCellRects(){
  const rects = new Map();
  exportData.panes.forEach(panedata => {
    panedata.forEach(entry => {
      rects.set(entry.score, entry.score.getBoundingClientRect());
      rects.set(entry.prob, entry.prob.getBoundingClientRect());
    });
  });
  return rects;
}

function applyFlipAnimation(beforeRects){
  exportData.panes.forEach(panedata => {
    panedata.forEach(entry => {
      [entry.score, entry.prob].forEach(cell => {
        const before = beforeRects.get(cell);
        if (!before) return;
        const after = cell.getBoundingClientRect();
        const dy = before.top - after.top;
        if (Math.abs(dy) < 0.5) return;
        cell.style.transition = "none";
        cell.style.transform = `translateY(${dy}px)`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            cell.style.transition = "";
            cell.style.transform = "";
          });
        });
      });
    });
  });
}

function resetPaneLayout(idx){
  const body = els.pane.bodys[idx];
  const panedata = exportData.panes[idx];
  body.querySelectorAll(".pane-cell.empty").forEach(el => el.remove());
  body.style.gridTemplateRows = "";

  const scoreHeader = body.querySelector(".pane-cell.coltitle.score");
  const probHeader = body.querySelector(".pane-cell.coltitle.prob");
  const fragment = document.createDocumentFragment();
  if (scoreHeader){
    scoreHeader.style.gridRow = "";
    fragment.appendChild(scoreHeader);
  }
  if (probHeader){
    probHeader.style.gridRow = "";
    fragment.appendChild(probHeader);
  }
  panedata.forEach(entry => {
    entry.score.style.gridRow = "";
    entry.prob.style.gridRow = "";
    fragment.appendChild(entry.score);
    fragment.appendChild(entry.prob);
  });
  body.replaceChildren(fragment);
}

function fixPaneContainerHeights(animate = false){
  const minH = 200;
  /*
  els.pane.bodys.forEach(body => {
    maxH = Math.max(maxH, body.offsetHeight);
  });
  els.pane.bodycontainers.forEach(container => {
    container.classList.toggle("animate-height", animate);
    container.style.height = maxH + "px";
  });
  */
  els.pane.bodys.forEach( (body, idx) => {
    let maxH = Math.max(minH, body.offsetHeight);
    const container = els.pane.bodycontainers[idx];
    container.classList.toggle("animate-height", animate);
    container.style.height = maxH + "px";
  });
}

function updatePaneAlignment(animate){
  const mode = els.alignpanes.value;
  const beforeRects = animate ? captureCellRects() : null;

  if (mode === "none"){
    els.pane.bodys.forEach((_, idx) => resetPaneLayout(idx));
    if (animate && beforeRects) applyFlipAnimation(beforeRects);
    fixPaneContainerHeights(animate);
    return;
  }

  const panes = exportData.panes;
  const issimpleatk = exportData.input?.issimpleatk ?? els.input.issimpleatk.checked;
  const mergedRows = buildMergedRows(panes, issimpleatk, mode);
  // 空の要素を挿入して隙間を空け、モードに合わせて並べ替え
  panes.forEach((panedata, paneIdx) => {
    const body = els.pane.bodys[paneIdx];

    const scoreHeader = body.querySelector(".pane-cell.coltitle.score");
    const probHeader = body.querySelector(".pane-cell.coltitle.prob");
    const fragment = document.createDocumentFragment();
    if (scoreHeader){
      scoreHeader.style.gridRow = "1";
      fragment.appendChild(scoreHeader);
    }
    if (probHeader){
      probHeader.style.gridRow = "1";
      fragment.appendChild(probHeader);
    }

    let panecount = 0;
    let emptycount = 0;
    for (let row of mergedRows){
      if (panedata.length <= panecount) break; // 終端以降はemptyを挿入しない
      const entry = row[paneIdx];
      if (entry){
        panecount++;
        entry.score.style.gridRow = "";
        entry.prob.style.gridRow = "";
        fragment.appendChild(entry.score);
        fragment.appendChild(entry.prob);
      }else{
        emptycount++;
        const scoreEmpty = document.createElement("div");
        scoreEmpty.className = "pane-cell score empty";
        const probEmpty = document.createElement("div");
        probEmpty.className = "pane-cell prob empty";
        fragment.appendChild(scoreEmpty);
        fragment.appendChild(probEmpty);
      }
    }

    body.replaceChildren(fragment);
    body.style.gridTemplateRows =
      `${PANE_HEADER_HEIGHT}px repeat(${panecount + emptycount}, ${PANE_ROW_HEIGHT}px)`;
  });

  if (animate && beforeRects) applyFlipAnimation(beforeRects);
  fixPaneContainerHeights(animate);
}

let isExportingAll = false;
let isExporting = false;
// 出力ボタンクリック処理
function exportAllPane(){
  // 出力ロック
  if (isExportingAll) return;
  isExportingAll = true;

  const values = getInputsWithSetCookie();
  const entries = Object.entries(values);
  // キーを"input-"を外したものに変更
  entries.forEach( entry => {
    const key = entry[0];
    const newkey = /^input-(.+)/.exec(key)?.[1];
    if (!newkey) return;
    entry[0] = newkey;
  });
  
  // 出力時の入力データをキャッシュしておく
  exportData.input = Object.fromEntries(entries);
  const panelv = els.pane.eqplvinputs;
  panelv[0].value = panelv[1].value = exportData.input.eqplv;
  panelv[0].oninput(); panelv[1].oninput();

  // condition-bar更新
  const {isarmor} = exportData.input;
  const typename = !isarmor ? "武器" : "防具";
  els.condition.eqptype.style.backgroundImage = `url("./images/${typename}.png")`;
  els.condition.eqptypeText.textContent = typename;

  exportPane(0);
  exportPane(1);
  isExportingAll = false;
}

function exportPane(idx){
  if ( !exportData.input ) return;;
  // 出力ロック
  if (isExporting) return;
  isExporting = true;
  
  let tensei = els.pane.tenseiinputs[idx].value;
  let eqplv = getValue(els.pane.eqplvinputs[idx]) ?? 0;
  eqplv = eqplv < 0 ? 0 : ~~eqplv;

  const input = exportData.input;
  const topnumMap = getTopnumMap(input, tensei, eqplv);
  // 再出力のためにキャッシュから表を生成する
  exportData.topnumMaps[idx] = topnumMap;
  buildPaneBody(idx)
  
  isExporting = false;
}

function buildPaneBody(idx){
  const topnumMap = exportData.topnumMaps?.[idx];
  if (!topnumMap) return;
  const itemnum = Math.max(1, getValue(els.export.numinput) ?? 1);
  const exporttype = getValue(els.export.type);
  const probMap = getProbMap(exportData.topnumMaps?.[idx], exporttype, itemnum);
  const body = els.pane.bodys[idx];
  body.replaceChildren();

  const fragment = document.createDocumentFragment();

  const scoreHeader = document.createElement("div");
  scoreHeader.className = "pane-cell coltitle score";
  scoreHeader.textContent = "Score";
  fragment.appendChild(scoreHeader);

  const probHeader = document.createElement("div");
  probHeader.className = "pane-cell coltitle prob";
  let modeText = 出力タイプ名テキスト[exporttype];
  if ( /^prob/.test(exporttype) ) modeText = itemnum + modeText;
  probHeader.textContent = modeText;
  fragment.appendChild(probHeader);

  const panedata = exportData.panes[idx] = [];

  let rowIdx = 0;
  probMap.forEach((prob, scoreKey) => {
    const alt = rowIdx % 2 === 0 ? " row-alt" : "";

    const scoreCell = document.createElement("div");
    scoreCell.className = "pane-cell score" + alt;
    scoreCell.textContent = scoreKey;
    fragment.appendChild(scoreCell);

    let [probint, probdecimal] = prob.toFixed().split(".");
    probdecimal ??= 0;
    if (probdecimal > 0) probint = probint + ".";

    const probCell = document.createElement("div");
    probCell.className = "pane-cell prob" + alt;
    probCell.innerHTML =
      `<span class="int">${probint}</span><span class="decimal">${probdecimal || ""}</span>`;
    fragment.appendChild(probCell);

    panedata.push({
      scoreKey,
      probKey: prob,
      rowIdx,
      score: scoreCell,
      prob: probCell,
    });
    rowIdx++;
  });

  body.appendChild(fragment);
  if (els.alignpanes.value !== "none"){
    updatePaneAlignment(true);
  }else{
    fixPaneContainerHeights();
  }
}


function getInputsWithSetCookie(mode = ""){ // default: すべて保存
  const isOnlyStatus = mode === "onlyStatus";
  const isWithoutStatus = mode === "withoutStatus";
  if (mode !== "" && !isOnlyStatus && !isWithoutStatus){
    console.error("getInputsWithSetCookie", "不明なモード", mode);
    return;
  }
  const inputs = {};
  cookieTargets.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return; // 非表示ステータスは保存しない
    const isStatus = els.statusinputs.some(parent => parent?.contains(el));
    const val = getValue(el);
    if ( isOnlyStatus && !isStatus ) return;
    if ( isWithoutStatus && isStatus) return;
    setCookie(id, val ?? "");
    inputs[id] = val;
  });
  return inputs;
}