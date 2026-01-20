// 1. 初始化變數
let currentIdx = 0;
let userScores = { EI: 0, SN: 0, TF: 0, JP: 0, AT: 0 };

// 2. 開始測驗
function startQuiz() {
    currentIdx = 0;
    userScores = { EI: 0, SN: 0, TF: 0, JP: 0, AT: 0 };
    document.getElementById('quiz-intro').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
    renderQuestion();
}

// 3. 渲染題目
function renderQuestion() {
    const q = mbtiQuestions[currentIdx]; // 從 questions.js 抓資料
    document.getElementById('q-text').innerText = q.text;
    
    // 更新進度條與文字
    const progress = ((currentIdx + 1) / mbtiQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = progress + "%";
    document.getElementById('progress-text').innerText = `${currentIdx + 1} / ${mbtiQuestions.length}`;
}

// 4. 處理回答與計分
function handleAnswer(value) {
    const q = mbtiQuestions[currentIdx];
    
    // 計分邏輯：選項值 (-3 ~ 3) * 題目方向 (1 或 -1)
    // 例如：EI 題，選非常同意(+3)，方向是E(1)，則 EI 分數 +3
    userScores[q.dim] += value * q.dir;

    currentIdx++;

    if (currentIdx < mbtiQuestions.length) {
        renderQuestion();
    } else {
        calculateFinalResult();
    }
}

// 5. 計算最終結果
function calculateFinalResult() {
    let mbti = "";
    mbti += userScores.EI >= 0 ? "E" : "I";
    mbti += userScores.SN >= 0 ? "S" : "N";
    mbti += userScores.TF >= 0 ? "T" : "F";
    mbti += userScores.JP >= 0 ? "J" : "P";
    
    const identity = userScores.AT >= 0 ? "A" : "T";
    const finalCode = `${mbti}-${identity}`;

    showResultPage(finalCode);
}

// 6. 顯示結果頁並生成圖片
function showResultPage(code) {
    document.getElementById('quiz-content').style.display = 'none';
    document.getElementById('result-page').style.display = 'block';
    
    // 取得前四碼來抓取資料庫內容
    const baseCode = code.split('-')[0];
    const data = personalityData[baseCode]; // 這裡會對應之後第五步的結果資料庫

    // 填入文字內容
    document.getElementById('res-code').innerText = code;
    document.getElementById('res-name').innerText = data.name;
    document.getElementById('res-description').innerHTML = `<p>${data.desc}</p>`;
    document.getElementById('res-celebs').innerText = data.celebs;

    // --- 關鍵：將 HTML 轉成圖片供長按儲存 ---
    const captureArea = document.getElementById('capture-area');
    
    // 稍微延遲一下確保內容已渲染
    setTimeout(() => {
        html2canvas(captureArea, {
            backgroundColor: "#ffffff",
            useCORS: true, // 允許跨域圖片（如果你有外部頭像）
            scale: 2       // 提高解析度，讓圖片更清晰
        }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const finalImg = document.createElement('img');
            finalImg.src = imgData;
            
            const wrapper = document.getElementById('final-image-wrapper');
            wrapper.innerHTML = ""; // 清空
            wrapper.appendChild(finalImg);
            
            // 隱藏原始的 HTML 區塊，只留圖片給用戶長按
            captureArea.style.display = "none";
        });
    }, 500);
}

// 返回與退出邏輯
function goHome() {
    // 根據你的網頁邏輯切換，這裡暫定為重新整理回初始狀態
    window.location.reload();
}

function confirmExit() {
    if (confirm("測驗尚未完成，確定要離開嗎？")) {
        goHome();
    }
}