

const 転生基準値リスト = [];


/* 武器転生の基準値
*   0: lv, 1: status1, 2: status2, 3: all%, 4: (ama), 5: hpmp
* , 6: def, 7: declv, 8: dam, 9: bossdam
*/

転生基準値リスト[0] = [
  [  0, 1,1,1,1,  3, 1,5,1,2],
  [ 10, 1,1,1,1, 30, 1,5,1,2],
  [ 20, 2,1,1,1, 60, 2,5,1,2],
  [ 30, 2,1,1,1, 90, 2,5,1,2],
  [ 40, 3,2,1,1,120, 3,5,1,2],
  [ 50, 3,2,1,1,150, 3,5,1,2],
  [ 60, 4,2,1,1,180, 4,5,1,2],
  [ 70, 4,2,1,1,210, 4,5,1,2],
  [ 80, 5,3,1,1.240, 5,5,1,2],
  [ 90, 5,3,1,1.270, 5,5,1,2],
  [100, 6,3,1,1,300, 6,5,1,2],
  [110, 6,3,1,1,330, 6,5,1,2],
  [120, 7,4,1,1,360, 7,5,1,2],
  [130, 7,4,1,1,390, 7,5,1,2],
  [140, 8,4,1,1,420, 8,5,1,2],
  [150, 8,4,1,1,450, 8,5,1,2],
  [160, 9,5,1,1,480, 9,5,1,2],
  [200,11,6,1,1,600,11,5,1,2],
  [250,12,7,1,1,700,12,5,1,2]
];

/* 防具転生の基準値
*   0: lv, 1: status1, 2: status2, 3: all%, 4: ama, 5: hpmp
* , 6: def, 7: declv, 8: spd, 9: jump
*/

転生基準値リスト[1] = [
  [  0, 1,1,1,1,  3, 1,5,1,1],
  [ 10, 1,1,1,1, 30, 1,5,1,1],
  [ 20, 2,1,1,1, 60, 2,5,1,1],
  [ 30, 2,1,1,1, 90, 2,5,1,1],
  [ 40, 3,2,1,1,120, 3,5,1,1],
  [ 50, 3,2,1,1,150, 3,5,1,1],
  [ 60, 4,2,1,1,180, 4,5,1,1],
  [ 70, 4,2,1,1,210, 4,5,1,1],
  [ 80, 5,3,1,1.240, 5,5,1,1],
  [ 90, 5,3,1,1.270, 5,5,1,1],
  [100, 6,3,1,1,300, 6,5,1,1],
  [110, 6,3,1,1,330, 6,5,1,1],
  [120, 7,4,1,1,360, 7,5,1,1],
  [130, 7,4,1,1,390, 7,5,1,1],
  [140, 8,4,1,1,420, 8,5,1,1],
  [150, 8,4,1,1,450, 8,5,1,1],
  [160, 9,5,1,1,480, 9,5,1,1],
  [200,11,6,1,1,600,11,5,1,1],
  [250,12,7,1,1,700,12,5,1,1]
];

const 列数抽選率リスト = {
  転生の炎: [0, 40, 40, 16, 4]
, 製作職人: [0, 21, 50, 25, 4]
, 製作名匠: [0,  0, 56, 40, 4]
, その他:   [0, 41, 40, 15, 4]
};


const 転生確率 = {
  転生深淵:{
    trate: [  0,  0, 63, 34,  3]
  , nrate: 列数抽選率リスト.転生の炎
  }
, 転生永遠:{
    trate: [  0, 29, 45, 25,  1]
  , nrate: 列数抽選率リスト.転生の炎
  }
, 転生強力:{
    trate: [ 20, 30, 36, 14,  0]
  , nrate: 列数抽選率リスト.転生の炎
  }
, 転生一般:{/* strategywiki.org参考 */
    trate: [ 50, 40,  9,  1,  0]
  , nrate: 列数抽選率リスト.転生の炎
  }
, 合成名匠:{
    trate: [  0, 40, 45, 14,  1]
  , nrate: 列数抽選率リスト.製作名匠
  }
, 合成職人:{
    trate: [ 25, 35, 30, 10,  0]
  , nrate: 列数抽選率リスト.製作職人
  }
, 合成一般:{
    trate: [ 50, 40, 10,  0,  0]
  , nrate: 列数抽選率リスト.その他
  }
, 製作名匠:{
    trate: [  0, 19, 50, 30,  1]
  , nrate: 列数抽選率リスト.製作名匠
  }
, 製作職人:{
    trate: [ 15, 30, 40, 14,  1]
  , nrate: 列数抽選率リスト.製作職人
  }
, 製作一般:{
    trate: [ 50, 40, 10,  0,  0]
  , nrate: 列数抽選率リスト.その他
  }
, ドロップ:{
    trate: [ 25, 30, 30, 14,  1]
  , nrate: 列数抽選率リスト.その他
  }
, 欠片交換:{
    trate: [ 25, 30, 30, 14,  1]
  , nrate: 列数抽選率リスト.その他
  }
, チャンスタイム:{
    trate: [  0, 30, 50, 19,  1]
  , nrate: 列数抽選率リスト.その他
  }
, その他:{
    trate: [ 25, 30, 30, 14,  1]
  , nrate: 列数抽選率リスト.その他
  }
};

/* 武器防具で分けない */
const コモンフォーム名リスト = [
  "isarmor", "eqplv", "rtype", "min", "isboss", "issimpleatk"
, "simpleatk", "weaponatk"
];

/* 武器防具で分ける */
const スコアフォーム名リスト = [];

/* 武器スコア */
スコアフォーム名リスト[0] = [
  "str", "dex", "int",  "luk",   "all", "atk",   "ma"
, "hp",  "mp",  "def",  "declv", "dam", "bossdam"
];

/* 防具スコア */
スコアフォーム名リスト[1] = [
  "str", "dex", "int",  "luk",   "all", "atk",   "ma"
, "hp",  "mp",  "def",  "declv", "spd", "jump"
];

/* cookie処理用フォーム名リスト */
const formnames = new Set(コモンフォーム名リスト).union( new Set(スコアフォーム名リスト[0]) ).union( new Set(スコアフォーム名リスト[1]) );

// 組み合わせ計算の省略用。combinations[n][m]でnCmを取り出す(n<=19,m<=4)
const combinations = [
  [1, 0, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [1, 2, 1, 0, 0],
  [1, 3, 3, 1, 0],
  [1, 4, 6, 4, 1],
  [1, 5, 10, 10, 5],
  [1, 6, 15, 20, 15],
  [1, 7, 21, 35, 35],
  [1, 8, 28, 56, 70],
  [1, 9, 36, 84, 126],
  [1, 10, 45, 120, 210],
  [1, 11, 55, 165, 330],
  [1, 12, 66, 220, 495],
  [1, 13, 78, 286, 715],
  [1, 14, 91, 364, 1001],
  [1, 15, 105, 455, 1365],
  [1, 16, 120, 560, 1820],
  [1, 17, 136, 680, 2380],
  [1, 18, 153, 816, 3060],
  [1, 19, 171, 969, 3876]
];

/*---- 読み込み後処理 ---------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  initialize();
});
function initialize(){
  initializewithcookies();
}

function initializewithcookies(){
  /*
  * 保存されたcookieでフォームを初期化する
  * 最終出力に使用した入力値
  */
  const cookiedata = {};
  let cdata = readCookiesAll();
  for( let [k, e] of Object.entries(cdata) ){
    if(k.indexOf("input-") != 0) continue;
    cookiedata[k] = e;
  }
  
  formnames.forEach((name)=>{
    name = "input-" + name;
    let d = cookiedata[name];
    if( d === undefined ) return;
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
  
  // isarmor, isboss, issimpleatkの状態を表示に反映させる
  let chkisarmor = document.getElementById('input-isarmor');
  let chkisboss = document.getElementById('input-isboss');
  let chkissimpleatk = document.getElementById('input-issimpleatk');
  setIsArmor(chkisarmor.checked);
  setIsSimpleAtk(chkissimpleatk.checked);
  setIsBoss(chkisboss.checked); //input-simpleatkの初期化を含むので最後
  
}

/*---- cookie処理 -----------------------------------------------*/
function setcookieform(){
  
  deleteCookiesAll();
  
  const data = {};
  formnames.forEach(name=>{
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
  
  setCookie(data, 1000);
}

function readCookiesAll(){
  let ret = {};
  document.cookie.replace(/ /g,"").split(";").forEach(a=>{
    let k, e;
    [k, e] = a.split("=");
    if( k !== "" ) ret[k] = decodeURIComponent(e);
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
    txt += "Secure;";
    txt += "SameSite=Strict;";
    document.cookie = txt;
  }
}
function deleteCookiesAll(){
  document.cookie.replace(/ /g,"").split(";").forEach(data=>{
    if( data !== "" ) document.cookie = data.split("=")[0] + '=;max-age=0;path=/;Secure;SameSite=Strict;'
  });
}

/*---- 出力ボタンが押されたときの処理 -----------------------------------*/
window.toomuch = false; //true:出力中
function onclickoutputbutton(e){
alert("output start " + toomuch);
console.log(1);
alert(1);
  if( toomuch ) return;
  toomuch = true;
  let isarmor = 0;     // 0:武器 1:防具
  let eqplv = 0;       // 装備レベル
  let origineqplv = 0; // 入力された装備レベル（表示用）
  let tenseidata = []; // 装備レベルに対応する転生基準値リスト
  let rtype = "";      // 転生抽選方法
  let min = 0;         // 出力最低値
  let isboss = true;      // ボス装備ボーナス 1:適用
  
  let issimpleatk = false; // 武器攻撃力の指定方法
  let simpleatk = 0; // 武器攻撃力目標RANK0,1-4（issimpleatk==true）
  let weaponatk = 0; // 武器攻撃力直接入力（issimpleatk==false）
  
  const inputcommons = {}; // コモン入力値　フォーム名リストに対応
  const inputscores = {};  // スコア入力値　フォーム名リストに対応
  const inputscorevalues = []; // スコアの並び順に従う配列
  const scoredatas = [];  // 転生能力ごとのスコア
  const weaponscoredatas = []; // 武器攻撃力スコア (issimpleatk==false)
  const weaponatkdatas = []; // 武器攻撃力転生 (issimpleatk==fakse)
  
console.log("proc start");
  
  // 入力値の取得と処理
  procCommonForm();
  procScoreForm();
  
console.log("inputcommons", inputcommons);
console.log("inputscores", inputscores);
console.log("sorted scoredatas", scoredatas);
  
  
  // エラー判定
  if( scoredatas[0][4] <= 0 ){
console.error("スコアが全て0");
  //  finalize();
  //  return;
  }
  
  // cookieに保存
  setcookieform();
  
alert("getEV start ");
  let list = getEV();
  let table = createTable(list);
  let title = createTitleElem();
  table.setProbs();
  createAndAddPanedata(table, title);
  
  finalize();
  return;
  
  //-----------------------------------------------------------------------
  /* 関数終了時処理（中断含む） */
  function finalize(){
    toomuch = false;
console.log("proc end");
    return;
  }
  
  /* input-type別の処理で入力フォームから値を取得する */
  function getInputValue(e){
    let v;
    // input-type別の方法で入力値を取得
    switch(e.type.toLowerCase()){
      case "number":
        v = e.valueAsNumber;//数字以外はNaN
        v = (isNaN(v) || v < 0 ) ? 0 : v;
        break;
      case "checkbox":
        v = e.checked;
        break;
      case "select-one":
        v = e.value;
        break
      default:;
    }
    return v;
  }
  
  /* コモンフォームの処理 */
  function procCommonForm(){
    コモンフォーム名リスト.forEach((name, idx)=>{
      //フォームの取得
      let e = document.getElementById("input-" + name);
      
      if(name == "issimpleatk" && isarmor) return;
      if(name == "simpleatk" && (isarmor || !issimpleatk)) return;
      if(name == "weaponatk" && (isarmor ||  issimpleatk)) return;

      //入力値の取得
      let v = getInputValue(e);
      
      switch(name){
        case "isarmor":
          isarmor = +v; break; //数値で格納
        case "eqplv":
          // 表示用に元の入力値を保存する
          origineqplv = v;
          // 転生基準値リストに含まれる数値に丸める
          for(let i = 転生基準値リスト[isarmor].length; i--;){
            if(v < 転生基準値リスト[isarmor][i][0]) continue;
            tenseidata = 転生基準値リスト[isarmor][i];
            eqplv = tenseidata[0];
            break;
          }
          break;
        case "rtype":
          rtype = v; break;
        case "min": 
          min = ~~v; break;//小数切り捨て
        case "isboss": 
          isboss = v; break;
        case "issimpleatk": 
          if(isarmor) return;
          issimpleatk = v; break;
        case "simpleatk":
          if(isarmor || !issimpleatk) return;
          simpleatk = +v; break
        case "weaponatk":
          if(isarmor ||  issimpleatk) return;
          weaponatk = ~~v; break;//小数切り捨て
        default:;
      }
      
      /* 入力フォームの数値を上書き */
      if(e.type == "number" && name != "eqplv"){
        if("" + e.value != "" + v) e.value = "" + v;
      }
      inputcommons[name] = v;
    });
  }

  /* スコアフォームの処理 */
  function procScoreForm(){
    スコアフォーム名リスト[isarmor].forEach((name, idx)=>{
      // フォームの取得
      let e = document.getElementById("input-" + name);

      // 入力値の取得
      let v = getInputValue(e);
      
      switch(name){
      }
      
      inputscores[name] = v;
      inputscorevalues[idx] = v;
    });
    
    /* スコア基準値*評価値をscoredatasに格納。降順ソートする
    *   0- 3: str, dex, int, luk
    *   4- 9: str+dex, str+int, str+luk, dex+int, dex+luk, int+luk
    *  10-14, all%, atk, ma, hp, mp
    *  15-18: def, declv, dam, boss(spd, jump)
    */
    let f = inputscorevalues;
    let t = tenseidata;
    
    for(let i = 0; i < 19; i++){
      let d;
      switch(i){
        case 0:/* ステータス1種 */
        case 1:
        case 2:
        case 3:
          d = BigNumber( f[0+i] ).times( t[1] );
          break
        case 4:/* STR+α */
        case 5:
        case 6:
          d = BigNumber( f[0+0] ).plus( f[0+i-3] ).times( t[2] );
          break
        case 7:/* DEX+α */
        case 8:
          d = BigNumber( f[0+1] ).plus( f[0+i-5] ).times( t[2] );
          break;
        case 9:/* INT+α */
          d = BigNumber( f[0+2] ).plus( f[0+i-6] ).times( t[2] );
          break;
        case 10:/* All% */
          d = BigNumber( f[4] ).times( t[3] );
          break;
        case 11:/* AMA */
        case 12:
          // 防具用
          d = BigNumber( f[5+i-11] ).times( t[4] );
          break;
        case 13:/* HPMP */
        case 14:
          d = BigNumber( f[7+i-13] ).times( t[5] );
          break;
        case 15:/* その他 */
        case 16:
        case 17:
        case 18:
          d = BigNumber( f[9+i-15] ).times( t[6+i-15] );
          break;
        default:;
      }
      
      //rank別スコア配列を生成
      scoredatas[i] = new Array(5);
      for(let rank = 0; rank <= 4; rank++){
        scoredatas[i][rank] = d.times( rank + 1 + isboss*2 );
      }
    }
    // 除外する項目の配列番号を格納しまとめて処理
    let splices = new Set(); // 重複禁止

    // 武器の場合、武器攻撃力の処理
    // 出力は 攻撃力RANK & 攻撃力以外のスコア で行うため攻撃力をscoredatasから除外
    if(!isarmor){
      if(issimpleatk){
      }else{
        // weaponatk * inputscoresで改めてスコア計算
        // AMAは入力スコアの大きい方を使い、攻撃力として扱う。魔力を0にする
        // （現状特に問題ないと思うので。必要になったら武器魔力入力欄を増やして対応）
        // 武器A転生計算式　ceil( atk * (~~(lv/40)+1) * ( rank+(isboss ? 2:0) ) * (1,1)**(rank-1)) )
        // エリートボスドロップはこれと異なる。設定の複雑化、正確な仕様の不明のため考慮しない
        // 現在未実装の250武器攻撃力はこの公式に従った推定値
        let lv = ~~(eqplv/40) + 1;
        let atkscore = Math.max(inputscores["atk"], inputscores["ma"]);
        for(let rank = 0; rank <= 4; rank++){
          let r1 = rank+1;
          let r2 = r1 + isboss*2;
          let atktensei = BigNumber( 1.1 ).pow( r1-1 ).times( lv ).times( r2 ).div(100).times( weaponatk ).integerValue(BigNumber.ROUND_CEIL);
          weaponscoredatas[rank] = atktensei.times(atkscore);
          weaponatkdatas[rank] = atktensei;
        }
      }
      scoredatas[12] = new Array(5).fill( BigNumber(0) ); //魔力を0にする
      splices.add(11); // 攻撃力は別で処理するため除外する
    }
    
    // レベルによる制限
    // 選ばれる候補から除外され、相対的に他転生がつきやすくなる処理だと仮定（未確認）
    if( !isarmor ){
      if( eqplv < 90 ) splices.add(18); // ボスダメ
    }else{
      if( eqplv < 60 ){// 11,12攻撃力・魔力
        splices.add(11);
        splices.add(12);
      }
      if( eqplv < 70 ) splices.add(10); // 10All%
    }
    
    // 番号大きい順にscoredatasから除外
    splices = Array.from(splices).sort((a, b) => b - a);
    splices.forEach(spl=>{
      scoredatas.splice(spl, 1);
    });
    
    // scoredatasの最大rankを比較し降順ソート
    scoredatas.sort((a,b)=>{ return ( a[4].lt(b[4]) - a[4].gt(b[4]) ); });
    
    
  }
  
  /* スコアごと確率を計算しリストを作成 */
  function getEV(){
let starttime = new Date();
let calccount1 = [,0,0,0,0];
let calccount2 = [,0,0,0,0];
    let result = [];
    
    let scdatas = scoredatas;
    let pweapon = (isarmor && !issimpleatk ? weaponscoredatas[4] : BigNumber(0));
    
    let tensei = 転生確率[rtype];
    let trate = tensei.trate;
    let nrate = tensei.nrate;
    
    // scoredatasの0スコアの数を数える
    let count0 = scdatas.length;
    for(let i = 0 ; i < scdatas.length; i++){
      if( scdatas[i][4].gt(0) ) count0--;
      else break;
    }
    
    // tenseinum=4の順列に変換するための補正数値。使用意図は誤差軽減と出力様式から
    // prob * revisions[tenseinum]で使う
    // [n] = 19P4/19Cn
    let num = scdatas.length + (!isarmor);
    const revisions = [0, (num-1)*(num-2)*(num-3)*1, (num-2)*(num-3)*1*2, (num-3)*1*2*3, 1*2*3*4 ];
    
    /* 転生列数の総当たり ボス装備は4列固定 */
    for(let tenseinum = 1; tenseinum <= 4; tenseinum++){
      // ボス装備なら4列固定
      if(isboss) tenseinum = 4;
      
      /**
      *   scdatasからtenseinum種選ぶ総当たり * rank4種総当たり
      *   武器は攻撃力を含むかで分割し、含む場合は4種目を攻撃力で固定する
      *   0スコアの転生はいくつ含まれるかだけで十分なので省略し、パターン数を掛けて一括計算
      */
      
      // 武器転生の場合、攻撃力が選ばれるか否かで2周させる
      for(let n4isatk = 1; n4isatk >= 0; n4isatk--){
        if( n4isatk == 1 ){
          if(isarmor) continue;
        }else{
          if( issimpleatk && simpleatk > 0 ) continue;
        }
        
        // scdatasからtenseinum種選ぶ組み合わせの総当たり。scdatasは転生スコアの高い順にソート済み
        let nlen = scdatas.length + n4isatk - 1; //18 or 17
        let p1, p2, p3, p4;
        n1:for(let n1 = 0;                           n1 <= nlen-3; n1++){ p1 = ( tenseinum >= 4 ? scdatas[n1][4] : BigNumber(0) );
        n2:for(let n2 = (tenseinum >= 4 ? n1+1 : 0); n2 <= nlen-2; n2++){ p2 = ( tenseinum >= 3 ? scdatas[n2][4] : BigNumber(0) );
        n3:for(let n3 = (tenseinum >= 3 ? n2+1 : 0); n3 <= nlen-1; n3++){ p3 = ( tenseinum >= 2 ? scdatas[n3][4] : BigNumber(0) );
        n4:for(let n4 = (tenseinum >= 2 ? n3+1 : 0); n4 <= nlen;   n4++){ p4 = ( !n4isatk       ? scdatas[n4][4] : pweapon );
calccount1[tenseinum]++;
          // 0スコア数を数え、0スコアと転生列数による走査短縮処理
          let select0 = 0;
          if( n4isatk ){
            n4 = nlen;
          }else if( p4.eq(0) ){
            select0++;
            n4 = nlen;
          }
          if( tenseinum >= 2 ){
            if( p3.eq(0) ){
              select0++;
              n3 = nlen-1;
            }
            if( tenseinum >= 3 ){
              if( p2.eq(0) ){
                select0++;
                n2 = nlen-2;
              }
              if( tenseinum >= 4 ){
                if( p1.eq(0) ){
                  select0++;
                  n1 = nlen-3;
                }
              }else n1 = nlen-3;
            }else n1=(n2=nlen-2)-1;
          }else n1=(n2=(n3=nlen-1)-1)-1;
          
          
          //ボーダー値による足切り
          if( !n4isatk || !issimpleatk ){
            if( min > 0 && p1.plus(p2).plus(p3).plus(p4).lt( min ) ){
              if( n3+1 == n4 || (n4isatk && !issimpleatk) ){
                if( n2+1 == n3 ){
                  if( n1+1 == n2 ){
                    break n1;
                  }
                  break n2;
                }
                break n3;
              }
              break;
            }
          }
          
          
          /* 転生RANKの組み合わせ総当たり */
          let chosen = new Array(5);
          for(let i = 0; i <= 3; i++){
            chosen[i+1] = (tenseinum >= 4-i) && (select0 < 4-i);
          }
          if( n4isatk ) chosen[4] = true;
          let sc1 = 0, sc2 = 0, sc3 = 0, sc4 = 0;
          for(let r4 = 4; r4 >= 0; r4--){ if( trate[r4] <= 0 ) continue; if( !chosen[4] ) r4 = 0;
            if( n4isatk && issimpleatk && simpleatk > r4+1 ) break; //simpleatkによる足切り
            if(        !chosen[4] ) r4 = 0;
            else if(     !n4isatk ) sc4 = scdatas[n4][r4];
            else if( !issimpleatk ) sc4 = weaponscoredatas[r4];
          for(let r1 = 4; r1 >= 0; r1--){ if( trate[r1] <= 0 ) continue;
            if( !chosen[1] ) r1 = 0; else sc1 = scdatas[n1][r1];
          for(let r2 = 4; r2 >= 0; r2--){ if( trate[r2] <= 0 ) continue;
            if( !chosen[2] ) r2 = 0; else sc2 = scdatas[n2][r2];
          for(let r3 = 4; r3 >= 0; r3--){ if( trate[r3] <= 0 ) continue;
            if( !chosen[3] ) r3 = 0; else sc3 = scdatas[n3][r3];
calccount2[tenseinum]++;
            let score = BigNumber(0).plus(sc1).plus(sc2).plus(sc3).plus(sc4);
            
            if( !n4isatk || !issimpleatk || simpleatk == r4+1){
              if( score.lt( min ) ) break;
            }
            
            // 合計スコアを整数に切り捨て数値型に戻す
            score = score.integerValue(BigNumber.ROUND_FLOOR).toNumber();
            
            // 確率計算
            // 分母を共通化するので、分子のみを整数で格納する
            // 出力時に共通分母で除算することで誤差を軽減する
            let prob = 1;
            prob *= ( chosen[1] ? trate[r1] : 100 );
            prob *= ( chosen[2] ? trate[r2] : 100 );
            prob *= ( chosen[3] ? trate[r3] : 100 );
            prob *= ( chosen[4] ? trate[r4] : 100 );
            
            // 0スコアの組み合わせ数combination(count0, sel0)を掛ける
            let sel0 = select0;
            if( sel0 > 0 ) prob *= combinations[ count0 ][ sel0 ];
            
            // 整数のまま分母を共通化するためにtenseinumの差を埋めた上で順列化する
            // MAX_SAFE_INTEGERを超える場合は誤差を受け入れるか別の方法で
            prob *= revisions[ tenseinum ] * (isboss ? 100 : nrate[ tenseinum ]);
            
            
            // 整数スコアごとに確率（この時点では組み合わせ数）を集計する
            // atkidx 武器簡易版はATKRANKごとに分ける。それ以外は0
            let atkidx = n4isatk && issimpleatk ? (r4+1) : 0;
            let res = result;
            res = res[ atkidx ] = (res[ atkidx ] || []);
            res[ score ]  = prob + (res[ score ]  || 0);
          }}}} // r1-r4終了
        }}}} // n1-n4終了
      } // n4isatk終了
    } // tenseinum終了
    
console.log("転生走査終了", (new Date() - starttime)/1000, calccount1, calccount2);
    // 1刻みスコア->確率の分子部分（組み合わせ数）リストへの変換
    let prob = 0;
    for(let aidx = result.length-1; 0 <= aidx; aidx--){
      let res1 = result[aidx];
      if( !res1 ) continue;
      for(let sidx = res1.length-1; 0 <= sidx; sidx--){// スコアは1刻みで出力するため未定義要素も処理する
        if( sidx == min-1 ){
          if( isarmor ) break;
          if( issimpleatk && aidx == simpleatk ) break;
          if( !issimpleatk ) break;
        }
        let res2 = res1[sidx];
        if( res2 ) prob += res2;
        res1[sidx] = prob;
      }
    }
console.log("リスト作成終了", (new Date() - starttime)/1000);
    return result;
  }
  
  
  function createTable(list) {
    let table = document.createElement("table");
    let rowidx = 0;
    let tr = table.insertRow();
    tr.classList.add("coltitle");
    tr.innerHTML = "<td>Score</td><td></td>";
    
    let trlist = {};
    
    // listが空の場合の表示用
    if( list.length <= 0 ){
      let rank = 0;
      let sc = 0;
      if( !isarmor && issimpleatk ){
        rank = simpleatk;
        sc = `R${simpleatk + (isboss ? 2 : 0)}_0`;
      }
      (list[rank] = [])[min] = 0;
    }
    
    list.forEach((scores, atkrank)=>{
      trlist[ atkrank ] = [];
      let scidx = 0;
      scores.forEach((prob, sc)=>{
        let row = table.insertRow();
        if( sc%5 == 0 ){
          row.classList.add("openerrow");
          row.onclick = rowshowhide.bind(row, trlist[atkrank], scidx, 0);
        }else{
          row.classList.add("hiderow");
          row.style.display = "none";
        }
        if( sc%10 <= 4 ){
          row.classList.add("nth10");
        }
        row.atkrank = atkrank;
        row.scidx = scidx;
        let probint = Math.trunc(prob);
        let probdecimal = prob - probint;
        probint = "" + probint + ( probdecimal > 0 ? "." : "" );
        probdecimal = ("" + probdecimal).split(".")[1] || "";
        
        let rank = 0;
        if( atkrank > 0 ) rank = atkrank + (isboss ? 2 : 0);
        if( !isarmor && issimpleatk ) sc = `R${rank}_${sc}`;
        
        row.innerHTML = `<td>${sc}</td><td></td>`; // 期待値入力はあとで
        trlist[ atkrank ].push(row);
        
        scidx++;
      });
    });
    
    //openerrowが一つもない場合はhiderowを表示する
    if( table.getElementsByClassName("openerrow").length < 1 ){
      for(let hiderow of table.getElementsByClassName("hiderow")){
        hiderow.style.display = "";
      }
    }
    
    table.trlist = trlist;
    table.data = list;
    table.openallrows = allrowshowhide.bind(table, 1);
    table.closeallrows = allrowshowhide.bind(table, -1);
    table.setProbs = setProbs;
    return table;
    
    function allrowshowhide(mode=1){
      if( mode <= 0 ) mode = -1;
      const rows = table.getElementsByClassName("openerrow");
      Array.from(rows).forEach(row=>{
        rowshowhide(table.trlist[row.atkrank], row.scidx, mode);
      });
    }
    function rowshowhide(list, idx, mode=0){ /*mode=0:自動 1:開く -1:閉じる*/
      for(var i = 1; i <= 4; i++){
        let n = idx+i;
        if(n < list.length){
          let st = list[n].style;
          st.display = mode == 0 ? (st.display == "none" ? "" : "none") : (mode > 0 ? "" : "none");
        }
        /* 最上段のopenerの場合は上方のhiderowも切り替える */
        n = idx-i;
        if(idx <= 4 && 0 <= n){
          let st = list[n].style;
          st.display = mode == 0 ? (st.display == "none" ? "" : "none") : (mode > 0 ? "" : "none");
        }
      }
      //ペインの高さ修正
      fixPanesdivHeight();
    }
  }
  
  function setProbs(){
    const list = table.data;
    const trlist = table.trlist;
    const exporttype = document.getElementById("exporttype");
    const type = exporttype.value;
    
    const coltitle = table.getElementsByClassName("coltitle")[0].children[1];
    coltitle.innerHTML = exporttype.selectedOptions[0].label;
    
    // 計算用の定数
    let num = scoredatas.length + (!isarmor);
    let div = num*(num-1)*(num-2)*(num-3)*100**5; /* 共通分母 5=転生4列+列数抽選率 */
    let e50 = new BigNumber( Math.LN2 );
    let e05 = new BigNumber( Math.LN2 ).plus( Math.LN10 );
    
    list.forEach((scores, atkidx)=>{
      let idx = 0;
      scores.forEach(prob=>{
        let td = trlist[atkidx][idx].children[1];
        if( prob <= 0 ){
          td.innerHTML = `<span class="int">0</span><span class="decimal"></span>`;
          idx++;
          return; 
        }
        switch( type ){
          case "numavg":
            prob = BigNumber(div).div(prob); break;
          case "num50": /* 誤差を許容する */
            prob = e50.div( Math.log(div-prob)-Math.log(div)).times(-1); break;
          case "num95":
            prob = e05.div( Math.log(div-prob)-Math.log(div)).times(-1); break;
          case "prob1":
            prob = BigNumber(prob).div(div); break;
          case "prob100":
            prob = BigNumber(prob).div(div).times(100); break;
          case "prob10000":
            prob = BigNumber(prob).div(div).times(10000); break;
        }
        let [probint, probdecimal] = prob.toFixed().split(".");
        if( probdecimal > 0 ) probint = "" + probint + ".";
        td.innerHTML = `<span class="int">${probint}</span><span class="decimal">${probdecimal||""}</span>`;
        idx++;
      });
    });
  }
  
  function createTitleElem(){
    const titleelem = document.createElement("div");
    titleelem.classList.add("panetitleelem");
    
    let eqpclass = !isarmor ? "武器" : "防具";
    let tenseiclass = "";
    switch( rtype.substr(0,2) ){
      case "転生" : 
        tenseiclass = rtype.substr(2,2); break;
      case "合成" :
      case "製作" :
        tenseiclass = rtype.substr(0,2); break;
      default:
        tenseiclass = "その他"; break;
    }
    [eqpclass, tenseiclass].forEach(name=>{
      let img = document.createElement("div");
      img.classList.add(name);
      img.classList.add("iconimg");
      titleelem.appendChild(img);
    });
    const kari = document.createElement("div");
    let eqplvdiv = `<div class="eqplvdiv">Lv.${origineqplv}</div>`;
    kari.innerHTML = eqplvdiv;
    eqplvdiv = kari.firstChild;
    titleelem.appendChild( eqplvdiv );
    
    const hamburger = document.createElement("div");
    hamburger.classList.add("hamburger");
    hamburger.innerHTML = `<span></span><span></span><span></span>`;
    let menuitems = ["＋全展開", "－全折畳", "&#x29C9;コピー"];
    const dropdown = createDropdown(menuitems, hamburger, function(item, idx){
      switch( idx ){
        case 0: table.openallrows(); break;
        case 1: table.closeallrows(); break;
        case 2: copyTableToClipboard(); break;
      }
    });
    titleelem.appendChild( dropdown );
    
    return titleelem;
  }
  
  function copyTableToClipboard() {
    var range = document.createRange();
    range.selectNode(table);
    window.getSelection().removeAllRanges(); // 選択をクリア
    window.getSelection().addRange(range);
    try {
      document.execCommand('copy'); // クリップボードにコピー
    } catch (err) {
      alert('コピーに失敗しました');
    }

    window.getSelection().removeAllRanges(); // 選択を解除
  }
}

