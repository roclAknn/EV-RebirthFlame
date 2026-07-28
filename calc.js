
function getTopnumMap(input, item, eqplv){

  const {isboss, issimpleatk, simpleatk} = input;
  const eqptype = input.isarmor ? "防具" : "武器";
  const isWeapon = !input.isarmor;
  const options = 転生オプション[eqptype];

  const itemRankProbs = 転生確率[item].ランク;
  const itemLineProbs = 転生確率[item].列数;
  const border = input.min;
  let maxrank = 5;
  let minrank = 1;
  for (; 1 < maxrank; maxrank--){
    if ( 0 < itemRankProbs[maxrank-1] ) break;
  }
  for (; minrank < maxrank; minrank++){
    if ( 0 < itemRankProbs[minrank-1] ) break;
  }
  const maxrank2 = maxrank + isboss * 2;
  const minrank2 = minrank + isboss * 2;
  const zero = BigNumber.zero;

  // レベルごとの転生基準値リストを取得
  let baseScores = null;
  {
    for(let i = 転生基準値リスト[eqptype].length - 1; 0 <= i; i--){
      let temp = 転生基準値リスト[eqptype][i];
      if (temp[0] <= eqplv){
        baseScores = temp; break;
      }
    }
  }
  // 有効スコアをまとめたスコア表 0スコア、対象外スコアを除く
  const notZeroScores = [];
  let weaponAtkScore = [];
  {
    const temparr = [0,1,2,3,4,5,6,7].map( e => BigNumber(e) );
    options.forEach( optname => {
      // 武器・atkは後でindex:0に入れる
      if (isWeapon && optname === "atk"){
        if (issimpleatk){
          // 攻撃魔力をatkにまとめるようにしたのでatkのみの処理
          weaponAtkScore = [...temparr].fill(zero);
        } else {
          weaponAtkScore = temparr.map( (e, idx) => {
            if ( idx < 3 &&  isboss ) return zero;
            if ( 5 < idx && !isboss ) return zero;
            return getAtkTensei(eqplv, e - isboss * 2, isboss).div(100)
              .times(input.weaponatk)
              .dp(0, BigNumber.ROUND_CEIL)
              .times(input.atk);
          });
        }
        return;
      }
      
      let score = zero;
      if (
        ["strdex", "strint", "strluk", "dexint", "dexluk", "intluk"].includes(optname)
      ){
        const st1 = optname.substr(0, 3);
        const st2 = optname.substr(3, 3);
        score = BigNumber(input[st1] ?? 0).plus(input[st2] ?? 0);
      } else if ( "bossdam" === optname ) {
        score = BigNumber(input.dam ?? 0);
      } else {
        score = BigNumber(input[optname] ?? 0);
      }
      if ( score.lte(0) ) return;
      const basescore = baseScores[転生基準値インデックス[optname]];
      notZeroScores.push( temparr.map( e => e.times(score).times(basescore) ) );
    });

    // スコア基準の高い順に並べ替え
    notZeroScores.sort( (a, b) => b[1].comparedTo(a[1]) );

    // 武器の場合、攻撃力を特別に処理するため先頭に入れる
    if (isWeapon) notZeroScores.unshift(weaponAtkScore);
  }
  

  /**
   * option数19、選択行数4で 
   * 19P4 * 100 * 100**4 < MAX_SAFE_INTEGER なので
   * 精度と速度のために分子を整数にするため
   * 分母を19P4としたときの分子を返す
   */
  // 転生列数の総当たり ボス装備は4列固定
  const optionNums = options.length;
  const notZeroNums = notZeroScores.length;
  const zeroNums = optionNums - notZeroNums;
  const resultMaps = Array.from({length: 5}, ()=>new Map());
  for (let linenum = isboss ? 4 : 1; linenum <= 4; linenum++){
    const resmap = resultMaps[linenum];
    const itemLineProb = isboss ? 100 : itemLineProbs[linenum];
    const getLen = (lineidx, n) => {
      /*
      * notZeroNums + 1 : 0でないスコアに0スコアを一つだけ含めた要素数
      * ただし全オプション数を越えないようにする
      */ 
      if (linenum < lineidx) return null;
      let ret = Math.min(
          notZeroNums + 1
        , optionNums - (linenum - lineidx)
      );
      if (ret <= n) return null;
      return ret;
    }
    // 転生オプション(スコア降順)組み合わせ総当り
    n1:for (let n1 = 0, n1len = getLen(1, n1) ?? n1+1; n1 < n1len; n1++){
      let s1 = 1 <= linenum ? notZeroScores[n1] : null;
      if (isWeapon && issimpleatk && 0 < simpleatk) n1len = n1; // 1つ目を攻撃力固定
      n2:for (let n2 = n1+1, n2len = getLen(2, n2) ?? n2+1; n2 < n2len; n2++){
        let s2 = 2 <= linenum ? notZeroScores[n2] : null;
        n3:for (let n3 = n2+1, n3len = getLen(3, n3) ?? n3+1; n3 < n3len; n3++){
          let s3 = 3 <= linenum ? notZeroScores[n3] : null;
          n4:for (let n4 = n3+1, n4len = getLen(4, n4) ?? n4+1; n4 < n4len; n4++){
            let s4 = 4 <= linenum ? notZeroScores[n4] : null;

            /*---- スコアの記録 ---------------------------------------*/
            const nzs = notZeroScores;
            const countNZ =
              notZeroNums <= n1 ? 0 :
              notZeroNums <= n2 ? 1 :
              notZeroNums <= n3 ? 2 :
              notZeroNums <= n4 ? 3 : 4;
            const selectedZeroNums = linenum > countNZ ? linenum - countNZ : 0;


            // 足切り：ランク総当り前
            const isWeaponAtk = (n1 == 0 && isWeapon);
            const isWeaponSimpleAtk = (isWeaponAtk && issimpleatk);
            if (0 < border && !isWeaponSimpleAtk){
              const gs = (sc) => (sc?.[maxrank2] ?? zero);
              const gnzs = (i) => (nzs[i]?.[maxrank2] ?? zero);
              const temp1 = isWeaponSimpleAtk ? zero : gs(s1);
              const sc = [null, temp1, gs(s2), gs(s3), gs(s4)];
              let maxscore;
              maxscore = temp1.plus(sc[2]).plus(sc[3]).plus(sc[4]);
              if (maxscore.lt(border)){
                maxscore = temp1.plus(sc[2]).plus(sc[3]).plus(gnzs(n3+1));
                if (maxscore.lt(border)){
                  maxscore = temp1.plus(sc[2]).plus(gnzs(n2+1)).plus(gnzs(n2+2));
                  if (maxscore.lt(border)){
                    if (isWeaponAtk) break n2; // 武器攻撃力を含む場合、n1はスコア順でないので判定しない
                    maxscore = temp1.plus(gnzs(n1+1)).plus(gnzs(n1+2)).plus(gnzs(n1+3));
                    if (maxscore.lt(border)){
                      break n1;
                    } else break n2
                  } else break n3;
                } else break n4;
              }
            }
            {// ランク総当りでスコアごとの組み合わせ数を格納
              // r1 ~ r4はボスボーナスなしのランク
              const boss = isboss * 2;
              const gsc = (sc, rank) => ( sc?.[rank + boss] ?? zero );
              const gsc2 = (i, rank) => gsc(nzs[i], rank);
              const gmax = (sc) => sc ? maxrank : minrank;
              const grp = (sc, rank) => sc ? itemRankProbs[rank-1] : 100; // 百分率整数
              const chkltborder = (sum, idx, lineidx) => {
                // 取りうる最大値での足切りチェック
                if ( border <= 0 ) return false;
                if ( !sum.lt(border)) return false;
                let sum2 = sum;
                for (let i = 1; i + lineidx <= 4; i++){
                  sum2 = sum2.plus(gsc2(idx+i, maxrank));
                }
                return sum2.lt(border);
              };
              let r1min = minrank;
              if (isWeaponSimpleAtk && 0 < simpleatk) r1min = Math.max(r1min, simpleatk);
              let isIgnoreBorder = false;
              r1:for (let r1 = gmax(s1); r1min <= r1; r1--){
                let sum1 = gsc(s1, r1);
                isIgnoreBorder = (isWeaponSimpleAtk && simpleatk < r1);
                if (!isIgnoreBorder && chkltborder(sum1, n1, 1)) break; 
                r2:for (let r2 = gmax(s2); minrank <= r2; r2--){
                  let sum2 = sum1.plus(gsc(s2, r2));
                  if (!isIgnoreBorder && chkltborder(sum2, n2, 2)) break;
                  r3:for (let r3 = gmax(s3); minrank <= r3; r3--){
                    let sum3 = sum2.plus(gsc(s3, r3));
                    if (!isIgnoreBorder && chkltborder(sum3, n3, 3)) break;
                    r4:for (let r4 = gmax(s4); minrank <= r4; r4--){
                      let sum4 = sum3.plus(gsc(s4, r4));
                      if (!isIgnoreBorder && chkltborder(sum4, n4, 4)) break;
                      
                      // スコア格納：足切りチェッククリア済み
                      // スコアごとに分子を合計する
                      let sum = sum4.decimalPlaces(0, 1); // スコアは整数に切り捨て
                      let count = combinations[zeroNums][selectedZeroNums]; // 0スコアの組み合わせ数
                      let topnum = count
                       * itemLineProb // 列数抽選率
                       * grp(s1, r1) * grp(s2, r2) * grp(s3, r3) * grp(s4, r4); // ランク抽選率
                      // keyは文字列
                      let key;
                      if (isWeapon && issimpleatk){
                        let atkRank = (n1 === 0) ? r1 + boss : 0;
                        if (atkRank <= 0 && (0 < border && sum <= 0)) continue;
                        key = `R${atkRank}_${sum}`;
                      } else {
                        key = "" + sum;
                      }
                      resmap.set( key, (resmap.get(key) ?? 0) + topnum );
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  // スコアごとの分子リスト(Map)の作成
  let topnumMap = new Map();
  {
    // 分母を19P4に統一するための補正。linenum=3ならrevisions[3]を分子にかける
    const revisions = (n => [0, (n-1)*(n-2)*(n-3)*1, (n-2)*(n-3)*1*2, (n-3)*1*2*3, 1*2*3*4])(optionNums);
    for (let linenum = 1; linenum < resultMaps.length; linenum++){
      const map = resultMaps[linenum];
      map.forEach( (topnum, score) => {
        topnum *= revisions[linenum];
        topnumMap.set( score, (topnumMap.get(score) ?? 0) + topnum );
      });
    }
    const grank = (key) => +(/^R(\d+)/.exec(key)?.[1] ?? 0);
    const gscore = (key) => +(/\d+$/.exec(key)?.[0] ?? 0);
    topnumMap = new Map(
      [...topnumMap.entries()].sort((a, b) => {
        // スコア降順：武器攻撃力ランク降順を優先
        a = a[0]; b = b[0];
        if (issimpleatk)
          return (grank(b) - grank(a)) || (gscore(b) - gscore(a)); // ランクが同じ(0)ならスコアの差を返す
        return gscore(b) - gscore(a);
      })
    );
  }
  
  let sumTopnumMap;
  {// 積み上げ確率の分子部分マップを作成（昇順）
    // 降順に合計、確率に変換してpush→最後にreverseで昇順に
    const entries = [...topnumMap.entries()];
    const bottomnum = (n => n*(n-1)*(n-2)*(n-3))(optionNums) * 100 * 100 ** 4; //19P4、列抽選、ランク抽選x4行
    let sum = 0;
    const temp = [];
    for (const [score, topnum] of entries){
      sum += topnum;
      temp.push([score, sum]);
    }
    sumTopnumMap = new Map(temp.reverse());
  }
  return sumTopnumMap;
}

function getProbMap(topnumMap, mode, itemnum){
  // 確率の分子マップをモードに合わせて加工。表出力用のマップを返す
  // 誤差を軽減するために可能な限り整数で扱っている
  const eqptype = exportData.input.isarmor ? "防具" : "武器";
  const optionNums = 転生オプション[eqptype].length;
   // bottomnum = 統一分母19P4 * 列抽選100 * ランク抽選100**4
  const bottomnum = ( n => n*(n-1)*(n-2)*(n-3) )(optionNums) * 100 * 100**4;
  
  const {one, zero} = Decimal;
  const [, mode1, mode2] = /^(num|prob)(.+)$/.exec(mode) ?? [];
  let func;
  let e50 = new Decimal(2).ln();
  let e05 = new Decimal(20).ln();
  if (mode1 == "num"){
    if (mode2 == "avg"){
      func = (t, b) => Decimal(b).div(t);
    } else {
      const commonfunc = (t, b)=>{
        return one.div( Decimal(b).div(b-t).ln() );
      }
      switch(mode2){
      case "50":
        func = (t, b) => e50.times(commonfunc(t, b)); break;
      case "95":
        func = (t, b) => e05.times(commonfunc(t, b)); break;
      }
    }
  } else if (mode1 == "prob"){
    func = (t, b) => {
      let a = Decimal(b-t).div(b).pow(itemnum);
      return one.minus( a ).times( +mode2 );
    }
  }

  let probMap = new Map();
  [...topnumMap.entries()].forEach(entry => {
    const [score, topnum] = entry;
    let prob = func( topnum, bottomnum ).toDecimalPlaces(exportRoundDegit);
    probMap.set(score, prob);
  });
  return probMap;
}
