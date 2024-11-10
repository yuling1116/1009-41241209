const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-button');
const showAllButton = document.getElementById('show-all');
const hideAllButton = document.getElementById('hide-all');

const imagePaths = [
    'img/11.png', 'img/22.png', 'img/33.png', 'img/44.png',
    'img/55.png', 'img/66.png', 'img/77.png', 'img/88.png'
];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer;

// 洗牌函數
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 動態生成卡片
function createBoard() {
    const shuffledImages = [...imagePaths, ...imagePaths];
    shuffle(shuffledImages);
    gameBoard.innerHTML = '';
    shuffledImages.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.innerHTML = '<span>?</span>';  // 正面顯示問號
        
        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.innerHTML = `<img src="${image}" alt="Card Image">`;
        
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        gameBoard.appendChild(card);
        cards.push(card);

        // 綁定點擊事件
        card.addEventListener('click', () => flipCard(card));
    });
}

// 統一翻轉到正面
function showAll() {
    cards.forEach(card => card.classList.add('flipped'));
}

// 統一翻轉到背面，延遲翻轉效果
function hideAll() {
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.remove('flipped');
        }, index * 100); // 依序翻轉
    });
}

// 開始遊戲邏輯
function startGame() {
    createBoard(); // 生成並洗牌卡片
    hideAll(); // 初始化隱藏所有卡片
    timer = setTimeout(() => showAll(), 10000); // 倒數10秒後翻開正面
}

// 檢查是否匹配
function flipCard(card) {
    // 若已翻兩張卡片或卡片已翻面則返回
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);

        // 如果翻了兩張卡片，檢查是否匹配
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const img1 = card1.querySelector('.card-back img').src;
    const img2 = card2.querySelector('.card-back img').src;

    if (img1 === img2) {
        // 如果兩張卡片匹配，隱藏它們
        setTimeout(() => {
            card1.style.visibility = 'hidden';
            card2.style.visibility = 'hidden';
            matchedPairs += 1;
            flippedCards = [];

            // 檢查是否所有卡片都配對完成
            if (matchedPairs === imagePaths.length) {
                setTimeout(() => alert('恭喜，你完成了遊戲！'), 500);
            }
        }, 500);
    } else {
        // 如果不匹配，1秒後翻回背面
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// 綁定按鈕事件
startButton.addEventListener('click', () => {
    clearTimeout(timer); // 清除計時器（如果有）
    startGame();
});

showAllButton.addEventListener('click', showAll);
hideAllButton.addEventListener('click', hideAll);
