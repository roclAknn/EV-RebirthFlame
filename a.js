function initialize(){
  initializeconsole();
  initializeform();
  initializeButtonCircle();
  createTable([]);
}

const cookiedata = {};
async function initializeform(){
  /*
  * 保存されたcookieを元にフォームを初期化します
  * 最終出力に使用した入力値が復元されます
  */
  let cdata = readCookiesAll();
  let k, e;
  for([k, e] of Object.entries(cdata)){
    if(k.indexOf("input-") != 0) continue;
    cookiedata[k] = e;
  }
  let flgoverwritten = false;
  formidx.forEach((name)=>{
    name = "input-" + name;
    let d = cookiedata[name];
    if( d === undefined ) return;
    flgoverwritten = true;
    let e = document.getElementById(name);
    switch(e.type.toLowerCase()){
      case "number":
        e.value = d
        break;
      case "checkbox":
        e.checked = (d.toLowerCase() == "true");
        break;
      case "select-one":
        e.selectedIndex = +d;
        break
      default:;
    }
  });
  if(flgoverwritten){
    await outputlog("前回の設定を復元しました");
  }
}
function setcookieform(){
  
  deleteCookiesAll();
  
  let data = {};
  formidx.forEach((name)=>{
    name = "input-" + name;
    let e = document.getElementById(name);
    switch(e.type.toLowerCase()){
      case "number":
        data[name] = e.value;
        break;
      case "checkbox":
        data[name] = e.checked;
        break;
      case "select-one":
        data[name] = e.selectedIndex;
        break
      default:;
    }
  });
  
  /* 古いバージョンのcookieか確認用(未使用) */
  data["updatedate"] = new Date().toGMTString();
  
  setCookie(data, 1000);
}

/*
* フォーム内ボタンは誤発防止のために長押し式にする
* 押下中に表示する円形タイマーゲージとイベントを追加する
*/
function initializeButtonCircle(){
  let btns = document.querySelectorAll(`#gridbox1 .button`);
  for(let btn of btns){
    btn.style.position = "relative";
    btn.innerHTML += `<svg style="position: absolute;left: 0px; top: 0px; width: 100%; height: 100%;" xmlns="http://www.w3.org/2000/svg"><circle class="button-circle" stroke-width="8" stroke="#6fdb6f" fill="none" style="r: 8px; cx: 13px; cy: 14px; stroke-width: 4px; transform: rotate(-90deg); transform-origin: 13px 14px 0px; display: none;"></circle></svg>`;
    btn.btncircle = btn.getElementsByClassName("button-circle")[0];
    btn.sid = -1;
    btn.onmouseleave = btn.onmouseup = btn.ontouchend = function(e){onbuttonup.call(this, e.type);}.bind(btn);
  }
}
function onbuttondown(type, callback){
  if( type != "touchstart" && Object.hasOwn(HTMLButtonElement.prototype, "ontouchstart")){
    return;
  }
  let btn = this;
  if(btn.sid != -1) clearInterval(btn.sid);
  btn.sid = -1;
  let circle = btn.btncircle;
  let len = 50;
  circle.style.strokeDasharray = len;
  circle.style.strokeDashoffset = len;
  circle.style.transition = "all 1s linear;";
  circle.style.display = "unset";
  
  let time = 2000;
  let interval = 30;
  st = +new Date();
  btn.sid = setInterval(function(){
    let timerrate = Math.min(1, (+new Date() - st)/time);
    circle.style.strokeDashoffset = "" +  (len * (1 - timerrate)) + "px";
    if (timerrate < 1) return;
    clearInterval(btn.sid);
    btn.sid = -1;
    btn.btncircle.style.display = "none";
    callback();
  }, interval);
}
async function onbuttonup(type){
  if( type != "touchend" && Object.hasOwn(HTMLButtonElement.prototype, "ontouchend")){
    return;
  }
  let btn = this;
  if(btn.sid == -1) return;
  clearInterval(btn.sid);
  btn.sid = -1;
  btn.btncircle.style.display = "none";
  await outputlog(`error: ボタンは長押ししてください`, "error");
}

async function initializeconsole(notips=false){
  let d = outputlog["console"] || (outputlog.console = document.getElementById("consolediv"));
  d.innerHTML = "";
  if(notips) return;
  await stop(500);
  await outputlog(`tips: 目標転生スコア以上を出すための転生の炎の消費数（期待値）表を出力します`, "tips");
  await outputlog(`tips: KMS(韓国版MapleStory)の公開情報などを元に計算します`, "tips");
  await outputlog(`tips: 出力処理はすべてブラウザ側で行います`, "tips");
  await outputlog(`tips: 表の生成時、cookieに設定が保存されます`, "tips", 1000);
  await outputlog("-------------------------------------");
  await outputlog(`tips: 未入力、負数、その他不適当な値は0として解釈します`, "tips");
  await outputlog(`tips: 価値のないステータス=0にしてください`, "tips");
  await outputlog(`tips: 等級+2、付与数4種はボスアドバンテージ設定です。通常は共に&#9745;または&#9744;です`, "tips");
  await outputlog(`tips: 出力最低値は精度には影響しません。減らすと負荷が増大します`, "tips");
  await outputlog(`tips: 誤差軽減&#9745;で微小誤差が軽減しますが、負荷が増大します`, "tips", 1000);
}

/*
*  ページ上のコンソールに行を追加する
*  awaitで呼び出すと描画待ちする
*/
async function outputlog(txt, classes="", stoptime=0, waitanime=false){
  let d = outputlog["console"] || (outputlog.console = document.getElementById("consolediv"));
  let p = document.createElement("p");
  p.className = classes;
  let date = new Date();
  date = "" + date.getHours().toString().padStart(2, "0")
       + ":" + date.getMinutes().toString().padStart(2, '0')
       + ":" + date.getSeconds().toString().padStart(2, '0')
       + "." + date.getMilliseconds().toString().padStart(3, '0');
  p.innerHTML = `${date}> ${txt}`;
  d.appendChild(p);
  d.scrollTo(0, d.scrollHeight);
  
  /*
  *  描画待ち処理
  *  requestAnimationFrameが描画の直前にresolveをコールバックする
  *  1行目と2行目の間で描画される
  */
  if(waitanime){
    await new Promise(resolve => requestAnimationFrame(resolve));
    await new Promise(resolve => requestAnimationFrame(resolve));
  }
  /* 出力インターバル */
  await stop(stoptime);
}

async function stop(stoptime=0){
  await new Promise(resolve => setTimeout(resolve, stoptime));
}

const trlist = [];
function createTable(list) {
  let keys = Object.keys(list).sort((a,b)=>{/* 昇順ソート */ return (+a > +b) - (+a < +b)});
  
  let table = document.createElement("table");
  let tr = table.insertRow(0);
  tr.classList.add("coltitle");
  tr.innerHTML = "<td>Score</td><td>平均消費数[個(回)]</td>";
  tr.onclick = function(len){
    /* 見出しクリックで全て開く(閉じる) */
    let mode = -1;
    if( this.classList.contains("opened")){
      this.classList.remove("opened");
    }else{
      this.classList.add("opened");
      mode = 1;
    }
    for(let i = 0; i < len; i++) if(trlist[i].classList.contains("openerrow")) rowshowhide(i, mode);
  }.bind(tr, keys.length);
  trlist.length = 0;
  
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i];
    let row = table.insertRow(i+1);
    trlist.push(row);
    if(k%5 == 0){
      row.classList.add("openerrow");
      row.onclick = rowshowhide.bind(row, i, 0);
    }else{
      row.classList.add("hiderow");
      row.style.display = "none";
    }
    let rateint = Math.trunc(list[k]);
    let ratedecimal = list[k] - rateint;
    rateint = "" + rateint + (ratedecimal > 0 ? "." : "");
    ratedecimal = ("" + ratedecimal).split(".")[1] || "";
    //console.log([list[k], rateint, ratedecimal]);
    row.innerHTML = `<td>${k}</td><td><span class="int">${rateint}</span><span class="decimal">${ratedecimal}</span></td>`;
  }
  let tdiv = document.getElementById("tablediv");
  tdiv.innerHTML = "";
  tdiv.appendChild(table);
  return false;
}

function rowshowhide(n, mode=0){ /*mode=0:自動 1:開く -1:閉じる*/
  for(var i = 1; i <= 4; i++){
    let nn = n+i;
    if(nn < trlist.length){
      let st = trlist[nn].style;
      st.display = mode == 0 ? (st.display == "none" ? "" : "none") : (mode > 0 ? "" : "none");
    }
    /* 最上段のopenerの場合は上方のhiderowも切り替える */
    nn = n-i;
    if(n <= 4 && 0 <= nn){
      let st = trlist[nn].style;
      st.display = mode == 0 ? (st.display == "none" ? "" : "none") : (mode > 0 ? "" : "none");
    }
  }
}

/*
*   0: lv, 1: status1, 2: status2, 3: ama, 4: all%, 5: hpmp
* , 6: spd, 7: jump, 8: declv, 9: def
*/

const tenseidata = [
[  0, 1,1,1,1,  3,1,1,5, 1],
[ 10, 1,1,1,1, 30,1,1,5, 1],
[ 20, 2,1,1,1, 60,1,1,5, 2],
[ 30, 2,1,1,1, 90,1,1,5, 2],
[ 40, 3,2,1,1,120,1,1,5, 3],
[ 50, 3,2,1,1,150,1,1,5, 3],
[ 60, 4,2,1,1,180,1,1,5, 4],
[ 70, 4,2,1,1,210,1,1,5, 4],
[ 80, 5,3,1,1.240,1,1,5, 5],
[ 90, 5,3,1,1.270,1,1,5, 5],
[100, 6,3,1,1,300,1,1,5, 6],
[110, 6,3,1,1,330,1,1,5, 6],
[120, 7,4,1,1,360,1,1,5, 7],
[130, 7,4,1,1,390,1,1,5, 7],
[140, 8,4,1,1,420,1,1,5, 8],
[150, 8,4,1,1,450,1,1,5, 8],
[160, 9,5,1,1,480,1,1,5, 9],
[200,11,6,1,1,600,1,1,5,11],
[250,12,7,1,1,700,1,1,5,12]
];

/*
* 参考ページ
* https://maplestory.nexon.com/Guide/OtherProbability/game/gameAddOption (2024-06-29)
* 
*/
const 列数抽選率リスト = {
  転生の炎: [0, 40, 40, 16, 4]
, 製作職人: [0, 21, 50, 25, 4]
, 製作名匠: [0,  0, 56, 40, 4]
, その他:   [0, 41, 40, 15, 4]
};

const 転生確率 = {
  転生深淵:{
    trate: [ 0,  0,  0, 63, 34,  3]
  , nrate: 列数抽選率リスト.転生の炎
  }
, 転生永遠:{
    trate: [ 0,  0, 29, 45, 25,  1]
  , nrate: 列数抽選率リスト.転生の炎
  }
, 転生強力:{
    trate: [ 0, 20, 30, 36, 14,  0]
  , nrate: 列数抽選率リスト.転生の炎
  }
, 転生一般:{/* strategywiki.org参考 */
    trate: [ 0, 50, 40,  9,  1,  0]
  , nrate: 列数抽選率リスト.転生の炎
  }
, 合成名匠:{
    trate: [ 0,  0, 40, 45, 14,  1]
  , nrate: 列数抽選率リスト.製作名匠
  }
, 合成職人:{
    trate: [ 0, 25, 35, 30, 10,  0]
  , nrate: 列数抽選率リスト.製作職人
  }
, 合成一般:{
    trate: [ 0, 50, 40, 10,  0,  0]
  , nrate: 列数抽選率リスト.その他
  }
, 製作名匠:{
    trate: [ 0,  0, 19, 50, 30,  1]
  , nrate: 列数抽選率リスト.製作名匠
  }
, 製作職人:{
    trate: [ 0, 15, 30, 40, 14,  1]
  , nrate: 列数抽選率リスト.製作職人
  }
, 製作一般:{
    trate: [ 0, 50, 40, 10,  0,  0]
  , nrate: 列数抽選率リスト.その他
  }
, ドロップ:{
    trate: [ 0, 25, 30, 30, 14,  1]
  , nrate: 列数抽選率リスト.その他
  }
, 欠片交換:{
    trate: [ 0, 25, 30, 30, 14,  1]
  , nrate: 列数抽選率リスト.その他
  }
, チャンスタイム:{
    trate: [ 0,  0, 30, 50, 19,  1]
  , nrate: 列数抽選率リスト.その他
  }
, その他:{
    trate: [ 0, 25, 30, 30, 14,  1]
  , nrate: 列数抽選率リスト.その他
  }
};

const formidx = [
  "lv",   "add", "nline", "rtype", "min", "gosa"
, "str",  "dex",   "int",  "luk"
, "atk",   "ma",   "all",   "hp",   "mp"
, "spd", "jump", "declv",  "def"
];
const formdata = [];
const formdata2 = [];
const scoredata = [];

async function ondo(e){
  await outputlog("-------------------------------------");
  for(let idx = 0; idx < formidx.length; idx++ ){
    /* formデータの取得と修正 */
    let name = formidx[idx];
    let e = document.getElementById("input-" + name);
    let v;
    
    switch(e.type.toLowerCase()){
      case "number":
        v = e.value;
        v = (isNaN(v) || +v < 0 ) ? 0 : +v;
        break;
      case "checkbox":
        v = e.checked;
        break;
      case "select-one":
        v = e.value;
        break
      default:;
    }
    
    /* 装備Lvは内部ではtenseidataに含まれる数値を使う */
    if(idx == 0){
      let vv;
      for(let i = tenseidata.length; i--;){
        if(v < tenseidata[i][0]) continue;
        vv = tenseidata[i];
        break;
      }
      formdata[idx] = vv;
      if(v != vv[0]){
        await outputlog(`装備Lv${v} は Lv${vv[0]} のデータを使用します`);
      }
    }
    /* 出力最低値は整数のみ受け付け */
    if(idx == 4){
      if(v != ~~v){
        await outputlog(`指定した出力最低値 ${v} は小数点以下を切り捨てます`);
        v = ~~v;
      }
    }
    
    /* 入力フォームの数値を上書き */
    if(e.type == "number"){
      if("" + e.value != "" + v) e.value = "" + v;
    }
    if(idx == 0){
    }else{
      formdata[idx] = v;
    }
  }
  
  /* cookieに保存 */
  setcookieform();
  
  /* スコア評価値を切り出す */
  formdata.splice(6).forEach((e, i)=>{
    formdata2[i] = e;
  });
  
  await outputlog(`-- 装備Lv:${formdata[0][0]} 等級+2:${formdata[1]} 付与数4固定:${formdata[2]} 種類:${formdata[3]} 出力最低値:${formdata[4]} 誤差軽減:${formdata[5]}`);
  await outputlog(`-- tenseidata=[${formdata[0].toString()}]`);
  await outputlog(`-- formdata2=[${formdata2.toString()}]`);
  
  /*
  *  スコア基準値*評価値をscoredataに格納。降順ソートする
  *    str, dex, int, luk
  *  , str+dex, str+int, str+luk, dex+int, dex+luk, int+luk
  *  , atk, ma, all%, hp, mp
  *  , spd, jump, declv, def
  */
  let 誤差軽減 = formdata[5];
  for(let i = 0; i < 19; i++){
    let d;
    let f = formdata2;
    let t = formdata[0];
    switch(i){
      case 0:/* ステータス1種 */
      case 1:
      case 2:
      case 3:
        d = BigNumber(f[0+i]).times(t[1]);
        break
      case 4:/* STR+α */
      case 5:
      case 6:
        d = BigNumber(f[0+0]).plus(f[0+i-3]).times(t[2]);
        break
      case 7:/* DEX+α */
      case 8:
        d = BigNumber(f[0+1]).plus(f[0+i-5]).times(t[2]);
        break;
      case 9:/* INT+α */
        d = BigNumber(f[0+2]).plus(f[0+i-6]).times(t[2]);
        break;
      case 10:/* AMA */
      case 11:
        d = BigNumber(f[4+i-10]).times(t[3]);
        break;
      case 12:/* All% */
        d = BigNumber(f[6]).times(t[4]);
        break;
      case 13:/* HPMP */
      case 14:
        d = BigNumber(f[7+i-13]).times(t[5]);
        break;
      case 15:/* その他 */
      case 16:
      case 17:
      case 18:
        d = BigNumber(f[9+i-15]).times(t[6+i-15]);
        break;
      default:
        d = BigNumber(0);
    }
    if( !誤差軽減 ) d = +d;
    scoredata[i] = d;
  }
  
  scoredata.sort((a,b)=>{/* 降順ソート */ return (+a < +b) - (+a > +b)});
  
  await outputlog(`-- scoredata=[${scoredata.toString()}]`);
  
  /* エラー判定 */
  if(scoredata[0] <= 0){
    await outputlog(`error: すべてのスコアが0`, "error");
    await outputlog(`tips: メインステータスを1としてそれを基準としたスコアの入力を推奨します`, "tips");
    return;
  }
  if(formdata[0][0] <= 70){
    await outputlog(`caution: 装着Lv70以下の処理はおそらく異なっていますが、未実装のため共通の処理で出力します`, "error");
  }
  
  let tenseirate = 転生確率[formdata[3]];
  let trate = tenseirate.trate;
  let nrate = formdata[2] ? [0, 0,0,0,100] : tenseirate.nrate;
  
  await outputlog(`-- 等級抽選確率=[${trate.toString()}]`)
  await outputlog(`-- 列数抽選確率=[${nrate.toString()}]`, "", 1000)
  
  await outputlog("-------------------------------------");
  await outputlog("table出力開始", "", 0, true);
  
  let list = getE( trate, nrate, scoredata, formdata[1], formdata[4], formdata[5]);
  createTable(list);
  
  await outputlog("table出力終了");
  await outputlog(`tips: 表をクリックすると細かいスコアも確認できます`, "tips");
  await outputlog(`tips: 表をエクセルにコピーして比較などに利用できます`, "tips");
  await outputlog(`tips: 期待値x0.7以内に出る確率:約 50 %`, "tips");
  await outputlog(`tips: 期待値x1.0以内に出る確率:約 63 %`, "tips");
  await outputlog(`tips: 期待値x2.0以内に出る確率:約 86 %`, "tips");
  await outputlog(`tips: 期待値x3.0以内に出る確率:約 95 %`, "tips");
}



function getE(trate, nrate, nobi, add, border, 誤差軽減){
  /*
  *  -- trate[]: Tier抽選率
  *  -- nrate[]: 転生列数抽選率
  *  -- nobi[]: 等級1の転生伸び値リスト
  *  -- add: boolean true等級+2
  *  -- border: int 出力最低値
  *  -- 誤差軽減: boolean true丸め誤差軽減のためにBigNumberを使用
  */
  const ncombin = [1, 19, 171, 969, 3876];
  
  let maxtier = add*2;
  for(let i = trate.length; --i;){
    if( trate[i] <= 0 ) continue;
    maxtier += i;
    break;
  }
  
  let list = {};
  for(let num = 1; num <= 4; num++){
    if( nrate[num] <= 0 ) continue;
    
    /* scoredataからnum種類抽出する総当り */
    /* 負荷軽減のため取りうる最大値が出力最低値を下回る場合は処理しない */
    let nlen = nobi.length;
    for(let n1 = 0; n1 <= nlen-num; n1++){
      if( !誤差軽減 ){
        let p = (nobi[n1] + (num < 2 ? 0 : nobi[n1+1] + (num < 3 ? 0 : nobi[n1+2] + (num < 4 ? 0 : nobi[n1+3])))) *maxtier;
        if(p < border) break;
      }else if( nobi[n1].plus( num < 2 ? 0 : nobi[n1+1] ).plus( num < 3 ? 0 : nobi[n1+2] ).plus( num < 4 ? 0 : nobi[n1+3]).times(maxtier) < border ) break;
    for(let n2 = (num < 2 ? nlen-num+1 : n1+1); n2 <= nlen-num+1; n2++){
      if( !(num < 2) ){
        if( !誤差軽減 ){
           p = (nobi[n1] + nobi[n2] + (num < 3 ? 0 : nobi[n2+1] + (num < 4 ? 0 : nobi[n2+2]))) *maxtier;
           if(p < border) break;
        }else if( nobi[n1].plus( nobi[n2] ).plus( num < 3 ? 0 : nobi[n2+1] ).plus( num < 4 ? 0 : nobi[n2+2]).times(maxtier) < border ) break;
      }
    for(let n3 = (num < 3 ? nlen-num+2 : n2+1); n3 <= nlen-num+2; n3++){
      if( !(num < 3) ){
        if( !誤差軽減 ){
          p = (nobi[n1] + nobi[n2] + nobi[n3] + (num < 4 ? 0 : nobi[n3+1])) *maxtier;
          if(p < border) break;
        }else if( nobi[n1].plus( nobi[n2] ).plus( nobi[n3] ).plus( num < 4 ? 0 : nobi[n3+1]).times(maxtier) < border ) break;
      }
    for(let n4 = (num < 4 ? nlen-num+3 : n3+1); n4 <= nlen-num+3; n4++){
      if( !(num < 4) ){
        if( !誤差軽減 ){
          p = (nobi[n1] + nobi[n2] + nobi[n3] + nobi[n4]) *maxtier;
          if(p < border) break;
        }else if( nobi[n1].plus( nobi[n2] ).plus( nobi[n3] ).plus( nobi[n4] ).times(maxtier) < border ) break;
      }
      /* 転生Tier総当り */
      let imax = maxtier - add*2;
      for(let i1 = (nobi[n1] == 0 || num < 1) ? imax : 1; i1 <= imax; i1++){ if( nobi[n1] > 0 && num >= 1 && trate[i1] <= 0 ) continue;
      for(let i2 = (nobi[n2] == 0 || num < 2) ? imax : 1; i2 <= imax; i2++){ if( nobi[n2] > 0 && num >= 2 && trate[i2] <= 0 ) continue;
      for(let i3 = (nobi[n3] == 0 || num < 3) ? imax : 1; i3 <= imax; i3++){ if( nobi[n3] > 0 && num >= 3 && trate[i3] <= 0 ) continue;
      for(let i4 = (nobi[n4] == 0 || num < 4) ? imax : 1; i4 <= imax; i4++){ if( nobi[n4] > 0 && num >= 4 && trate[i4] <= 0 ) continue;
        /* スコア(切り捨て)が一致する抽選結果を集計して格納する */
        if( !誤差軽減 ){
          p = ( num < 1 ? 0 : nobi[n1]*( i1+add*2 ) )
            + ( num < 2 ? 0 : nobi[n2]*( i2+add*2 ) )
            + ( num < 3 ? 0 : nobi[n3]*( i3+add*2 ) )
            + ( num < 4 ? 0 : nobi[n4]*( i4+add*2 ) );
        }else{
          p = ( num < 1 ? BigNumber(0) : nobi[n1].times( i1+add*2 ) )
            .plus( num < 2 ? 0 :         nobi[n2].times( i2+add*2 ) )
            .plus( num < 3 ? 0 :         nobi[n3].times( i3+add*2 ) )
            .plus( num < 4 ? 0 :         nobi[n4].times( i4+add*2 ) );
        }
        
        p = ~~p;
        if(p < border) continue;
        
        /* 誤差軽減のため整数計算。除算は別でする。現在の母数は19P4*100**5 < Number.MAX_SAFE_INTEGER */
        let r;
        r = ( nobi[n1] == 0 || num < 1 ? 100 : trate[i1])
          * ( nobi[n2] == 0 || num < 2 ? 100 : trate[i2])
          * ( nobi[n3] == 0 || num < 3 ? 100 : trate[i3])
          * ( nobi[n4] == 0 || num < 4 ? 100 : trate[i4]) *nrate[num]
          * ( num == 4 ? 4*3*2*1 : ( num == 3 ? 16*3*2*1 : ( num == 2 ? 17*16*2*1 : ( num == 1 ? 18*17*16*1 : 0 ))));
        list["" + p] = (list["" + p] || 0) + r;
        
      }}}}
    }}}}
  }
  
  /*
  *  スコア個別の確率から合計の期待値に変換
  *  抜け番スコアはそれ以上かつ一番近いスコアと同じデータを格納する
  */
  let keys = Object.keys(list).sort((a,b)=>{/* 降順ソート */ return (+a < +b) - (+a > +b)});
  if(0){
    let r;
    if( !誤差軽減 ) r = 0;
    else r = BigNumber(0);
    for(let i = +keys[0], imin = keys[keys.length-1]; imin <= i; i--){
      if(list[i]){
        if( !誤差軽減 ) r += +list[i];
        else r = r.plus( +list[i] );
      }
      list[i] = 1/r;
    }
  }else{
    let r = 0;
    let div = 19*18*17*16 *100**5;
    for(let i = +keys[0], imin = keys[keys.length-1]; imin <= i; i--){
      if(list[i]){
        r += +list[i];
      }
      list[i] = div/r;
    }
    return list;
  }
}


/*--cookie処理----------------------*/
function readCookiesAll(){
  let ret = {};
  document.cookie.replace(/ /g,"").split(";").forEach((a)=>{
    let k, e;
    [k, e] = a.split("=");
    ret[k] = decodeURIComponent(e);
  });
  return ret;
}
function setCookie(arr={}, day=1000){
  let k,e;
  for([k, e] of Object.entries(arr)){
    let txt = "";
    txt += encodeURIComponent(k) + "=" + encodeURIComponent(e)+";";
    txt += "expires=" + new Date(+new Date() + day*24*60*60*1000).toGMTString() + ";";
    txt += "path=/;"
    document.cookie = txt;
  }
}
function deleteCookiesAll(){
  document.cookie.replace(/ /g,"").split(";").forEach((data)=>{
    document.cookie = data.split("=")[0] + '=;max-age=0'
  });
}
