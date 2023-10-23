// 変数宣言
let   nowPage  = 0;     //現在のページ
const arrWords = [];    //単語と意味を入れる配列


//---------自作関数-------------//

//文字入力チェック関数
function chkInput(iptTxt){
    //インプットの内容を空白消して取得
    const iptVal = $.trim( iptTxt.value );

    // 空白の場合、背景を赤にする
    if(iptVal == ""){
        iptTxt.classList.add("red_bgc");
    }else{
        iptTxt.classList.remove("red_bgc");
    }
}

//正解の時、丸付けする関数
function chkMaru(iptTxt){

    // 答えが合っている時
    if(iptTxt.value == arrWords[nowPage].ans){

        // 紙吹雪発動
        confetti({
            particleCount: 600,
            spread: 100,
            origin: { y: 0 }
        });


        //時間取得
        let date = new Date();
        let time = date.getTime();

        // プロパティにタイムスタンプ付与して代入
        let src = '<img id="akamaru" src="./img/akamaru.gif?'+ time + '">';

        // gifが入っているタグを一旦消して再代入
        $("#akamaruDiv").html('').html(src);

        //答えを表示(クリック処理)
        $("#ansWordBtn").click();

        // 入力の背景の赤を削除
        $("#iptWord").removeClass("red_bgc");

        // 次の単語へボタンにフォーカス
        $("#nextWordBtn").focus();


    }
    // 間違っている場合
    else{
        // 背景を赤にする
        $("#iptWord").addClass("red_bgc");
    }

}

// 解答場所を初期化する関数
function clearStudyWord(){
        // gifが入っているタグを削除
        $("#akamaruDiv").html('');

        //単語表示名変更
        $("#studyWord").html(arrWords[nowPage].word);

        // 答えを見るボタンを表示
        $("#ansWordBtn").slideDown(10);
        // 答えを非表示
        $("#ansWord").slideUp(10);

        // インプットの内容を消去して再フォーカス
        $("#iptWord").removeClass("red_bgc").val("").focus();

        // 解答場所を非表示にして表示
        $("#study_div").slideUp(10).slideDown(10);

        // ボタン名の変更
        $("#nextWordBtn").html("").html("次の単語へ");
}


//---------メイン画面-------------//

// 単語を覚えるボタンをクリックしたとき
$("#start").on("click",function () {

    //メイン画面を非表示にする
    $("#main").hide(10);

    //勉強画面を表示する
    $("#study_page").show(10);

    // 配列に単語が入っていれば解答場所表示
    if(arrWords.length != 0){

        // 現在のページ番号を初期化
        nowPage = 0;

        //単語未登録用テキストを非表示
        $("#notStudy").css("display","none");

        // 解答場所表示
        $(".study_box").css("display","block");

        // 解答場所を初期化する関数
        clearStudyWord();


        //登録単語が１個の場合は次の単語へボタン非表示
        if(arrWords.length == 1){
            $("#nextWordBtn").hide(10);
        }else{
            $("#nextWordBtn").show(10);
        }
    // 配列内に単語が未登録の場合
    }else{
        // 解答場所非表示
        $(".study_box").css("display","none");

        //登録してない場合のテキストを表示
        $("#notStudy").css("display","block");

        //最初に戻るボタンにフォーカス
        $("#study_end").focus();
    }
});


// 単語を追加ボタンをクリックしたとき
$("#add").on("click",function () {

    //メイン画面を非表示にする
    $("#main").hide(10);
    
    // 単語編集画面を表示させる
    $("#edit_page").show(10);

});


//---------単語編集画面-------------//

// 登録ボタンをクリックしたとき
$("#add_word_btn").on("click",function () {

    //空白及びスペースを削除して代入
    let addWord = $.trim( $("#add_word").val() ) ;
    let addMean = $.trim( $("#add_mean").val() ) ;
    
    //入力チェック
    if(addWord == "" || addMean == ""){
        if(addMean == ""){
            $("#add_mean").addClass("red_bgc").val("").focus();
        }
        if(addWord == ""){
            $("#add_word").addClass("red_bgc").val("").focus();
        }

        alert("未入力箇所があります");

        return;     //処理終了（ここから先は処理しない）
    }


    // 配列に追加用の変数
    let addTmp = {word:addWord,ans:addMean};

    // 配列に追加
    arrWords.push(addTmp);

    //登録したアラートを表示
    alert("登録しました！");

    //単語編集画面のインプット内容を消す
    $("#add_word").val("");
    $("#add_mean").val("");

});


// 編集終了ボタンをクリックしたとき
$("#edit_end").on("click",function () {

    // 単語編集画面を非表示にする
    $("#edit_page").hide(10);


    // メイン画面を表示にする
    $("#main").show(10);

    //単語編集画面のインプット内容を消す
    $("#add_word").val("").removeClass("red_bgc");
    $("#add_mean").val("").removeClass("red_bgc");

});


//---------勉強画面-------------//

// 答えを見るボタンをクリック
$("#ansWordBtn").on('click',function(){
    // 順次処理
    $.when(
        // 答えを見るボタンを非表示
        $("#ansWordBtn").slideUp(300)
    ).done(function(){
        // 答えを一旦消して表示
        $("#ansWord").html("").html("答え："+ arrWords[nowPage].ans).slideDown(300);
    });
});


//勉強終了画面をクリック
$("#study_end").on('click',function (){

    //勉強画面を非表示
    $("#study_page").hide(10);

    // メイン画面を表示にする
    $("#main").show(10);

});

// 次の単語へボタンをクリック
$("#nextWordBtn").on('click',function () {

    // ページ用変数に1加算
    nowPage += 1;

    // 次のページがある場合
    if($("#nextWordBtn").html() == "次の単語へ"){

        // 解答場所を初期化する関数
        clearStudyWord();


        // 最後の単語の場合は次の単語へボタン名を変更
        if(nowPage + 1 == arrWords.length){
            $("#nextWordBtn").html("").html("最初の単語に戻る");
        }
    }
    // 最後のページの場合
    else{

        // ページ用変数初期化
        nowPage = 0;

        // 解答場所を初期化する関数
        clearStudyWord();

    }

});
