document.addEventListener('DOMContentLoaded', () => {
    
    //variables
    const landingScreen = document.getElementById('landing-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    
    //buttons
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const menuBtn = document.getElementById('menu-btn');
    const optionBtns = document.querySelectorAll('.game-btn');
    
    //gameelements
    const pScoreEl = document.getElementById('p-score');
    const cScoreEl = document.getElementById('c-score');
    const statusText = document.getElementById('status-text');
    const pHand = document.getElementById('player-hand');
    const cHand = document.getElementById('computer-hand');
    const winnerDisplay = document.getElementById('winner-display');
    const finalScoreDisplay = document.getElementById('final-score-display');
    
    //bubbles
    const pBubble = document.getElementById('p-bubble');
    const cBubble = document.getElementById('c-bubble');

    //game configuration
    const WINNING_SCORE = 3; 
    let playerScore = 0;
    let computerScore = 0;
    let isGameActive = false;

    //text assets
    const bubblePhrases = [
        "Haha! You suck", 
        "Yahooooo!", 
        "I am feeling it", 
        "Yess!",
        "Ez Game!"
    ];

    //pallete constants
    const COL_ACCENT = '#ffcc00'; // Retro Yellow
    const COL_WHITE = '#ffffff';
    const COL_DIM = '#333333';

    //navigation logic
    
    startBtn.addEventListener('click', () => {
        landingScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        gameScreen.classList.add('fade-in');
        resetMatch();
    });

    restartBtn.addEventListener('click', () => {
        endScreen.classList.add('hidden');
        resetMatch();
    });

    menuBtn.addEventListener('click', () => {
        gameScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        landingScreen.classList.remove('hidden');
    });

    //gameplay logic

    optionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const playerChoice = this.getAttribute('data-choice');
            if(!isGameActive && playerScore < WINNING_SCORE && computerScore < WINNING_SCORE) {
                runRound(playerChoice);
            }
        });
    });

    const runRound = (playerChoice) => {
        isGameActive = true;
        
        // reset UI
        statusText.textContent = "...";
        hideBubbles();
        
        // reset hands to Yellow
        pHand.textContent = '✊';
        cHand.textContent = '✊';
        setHandColor(pHand, COL_ACCENT);
        setHandColor(cHand, COL_ACCENT);
        
        // Shake Animation
        pHand.classList.add('shake-player');
        cHand.classList.add('shake-computer');
        optionBtns.forEach(btn => btn.classList.add('disabled-btn'));

        // result calculation
        setTimeout(() => {
            const choices = ['rock', 'paper', 'scissors'];
            const computerChoice = choices[Math.floor(Math.random() * choices.length)];
            const emojis = { rock: '✊', paper: '✋', scissors: '✌️' };
            
            // show Hands
            pHand.textContent = emojis[playerChoice];
            cHand.textContent = emojis[computerChoice];
            pHand.classList.remove('shake-player');
            cHand.classList.remove('shake-computer');

            // determine winner
            processResult(playerChoice, computerChoice);

            // unlock inputs
            isGameActive = false;
            optionBtns.forEach(btn => btn.classList.remove('disabled-btn'));

            // check Game Over
            checkMatchEnd();

        }, 1200);
    };

    // helper to change hand color
    const setHandColor = (element, color) => {
        element.style.textShadow = `0 0 0 ${color}`;
    };

    const processResult = (player, computer) => {
        if (player === computer) {
            statusText.textContent = "DRAW";
            setHandColor(pHand, COL_WHITE);
            setHandColor(cHand, COL_WHITE);
        } 
        else if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            statusText.textContent = "HIT";
            playerScore++;
            pScoreEl.textContent = playerScore;
            
            // highlight Winner Yellow, Loser Dim
            setHandColor(pHand, COL_ACCENT);
            setHandColor(cHand, COL_DIM);
            
            showBubble(pBubble);
        } 
        else {
            statusText.textContent = "MISS";
            computerScore++;
            cScoreEl.textContent = computerScore;
            
            // highlight CPU Yellow, player Dim
            setHandColor(cHand, COL_ACCENT);
            setHandColor(pHand, COL_DIM);

            showBubble(cBubble);
        }
    };

    const showBubble = (bubbleEl) => {
        const text = bubblePhrases[Math.floor(Math.random() * bubblePhrases.length)];
        bubbleEl.textContent = text;
        bubbleEl.classList.remove('hidden');
        
        setTimeout(() => {
            bubbleEl.classList.add('hidden');
        }, 2000);
    };

    const hideBubbles = () => {
        pBubble.classList.add('hidden');
        cBubble.classList.add('hidden');
    };

    const checkMatchEnd = () => {
        if (playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
            setTimeout(() => {
                endScreen.classList.remove('hidden');
                
                finalScoreDisplay.textContent = `${playerScore} - ${computerScore}`;
                
                if (playerScore > computerScore) {
                    winnerDisplay.textContent = "You win - CPU shuts Down!";
                    winnerDisplay.style.color = COL_ACCENT;
                } else {
                    winnerDisplay.textContent = "CPU wins - You Lose Mate !";
                    winnerDisplay.style.color = COL_WHITE;
                }
            }, 1000); 
        }
    };

    const resetMatch = () => {
        playerScore = 0;
        computerScore = 0;
        pScoreEl.textContent = '0';
        cScoreEl.textContent = '0';
        statusText.textContent = "VS";
        hideBubbles();
        
        pHand.textContent = '✊';
        cHand.textContent = '✊';
        setHandColor(pHand, COL_ACCENT);
        setHandColor(cHand, COL_ACCENT);
        
        isGameActive = false;
        optionBtns.forEach(btn => btn.classList.remove('disabled-btn'));
    };
});