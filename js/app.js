/**
 * ========================================================
 * 🚀 المتحكم الرئيسي في التطبيق (Main App Controller)
 * الإصدار الرسمي - مسابقة بطل العالمية اكسبريس
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // ===================================================
    // عناصر الشاشات
    // ===================================================
    const screens = {
        login: document.getElementById('screenLogin'),
        welcome: document.getElementById('screenWelcome'),
        scratch: document.getElementById('screenScratch'),
        result: document.getElementById('screenResult')
    };

    // شاشة الدخول
    const loginForm = document.getElementById('loginForm');
    const userIdInput = document.getElementById('userId');
    const nationalIdInput = document.getElementById('nationalId');
    const loginErrorMsg = document.getElementById('loginErrorMsg');

    // كارت تنبيه المشاركة المسبقة
    const alreadyParticipatedBox = document.getElementById('alreadyParticipatedBox');
    const lockoutTitle = document.getElementById('lockoutTitle');
    const lockoutDesc = document.getElementById('lockoutDesc');
    const lockoutResultPreview = document.getElementById('lockoutResultPreview');
    const viewPreviousResultBtn = document.getElementById('viewPreviousResultBtn');
    const lockoutBackBtn = document.getElementById('lockoutBackBtn');
    const devResetStorageBtn = document.getElementById('devResetStorageBtn');

    // شاشة الترحيب
    const welcomeGreetingText = document.getElementById('welcomeGreetingText');
    const welcomeAvatar = document.getElementById('welcomeAvatar');
    const startScratchBtn = document.getElementById('startScratchBtn');

    // كارت الخربشة والساسبينس
    const scratchMainCard = document.getElementById('scratchMainCard');
    const scratchCardUserName = document.getElementById('scratchCardUserName');
    const scratchCardUserRegion = document.getElementById('scratchCardUserRegion');
    const scratchContainer = document.getElementById('scratchContainer');
    const scratchPrizeLayer = document.getElementById('scratchPrizeLayer');
    const scratchCanvas = document.getElementById('scratchCanvas');
    const prizeIcon = document.getElementById('prizeIcon');
    const prizeTitle = document.getElementById('prizeTitle');
    const prizeDesc = document.getElementById('prizeDesc');

    // الساسبينس
    const suspenseOverlay = document.getElementById('suspenseOverlay');
    const suspenseTitle = document.getElementById('suspenseTitle');
    const suspenseCountdown = document.getElementById('suspenseCountdown');
    const hypeMsg = document.getElementById('hypeMsg');
    const hypeIcon = document.getElementById('hypeIcon');
    const coinCursorTool = document.getElementById('coinCursorTool');
    const skipToResultBtn = document.getElementById('skipToResultBtn');

    // شاشة النتيجة
    const winnerResultSection = document.getElementById('winnerResultSection');
    const hardLuckResultSection = document.getElementById('hardLuckResultSection');
    const resultBigIcon = document.getElementById('resultBigIcon');
    const resultMainHeading = document.getElementById('resultMainHeading');
    const resultPrizeName = document.getElementById('resultPrizeName');
    const resultPrizeSub = document.getElementById('resultPrizeSub');
    const googleFormClaimBtn = document.getElementById('googleFormClaimBtn');
    const resultPrizeImage = document.getElementById('resultPrizeImage');
    const logoutBtn = document.getElementById('logoutBtn');

    // عناصر التحكم العامة
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const helpInfoBtn = document.getElementById('helpInfoBtn');

    // عناصر مؤشر المخزن في شاشة الدخول
    const inv100El = document.getElementById('invCount100');
    const inv200El = document.getElementById('invCount200');
    const inv100BarEl = document.getElementById('invBar100');
    const inv200BarEl = document.getElementById('invBar200');

    // ===================================================
    // حالة التطبيق
    // ===================================================
    let currentUser = null;
    let currentPrize = null;
    let activeScratchCard = null;
    let revealTransitionTimeout = null;

    function clearRevealTimers() {
        if (revealTransitionTimeout) { clearTimeout(revealTransitionTimeout); revealTransitionTimeout = null; }
        if (skipToResultBtn) skipToResultBtn.style.display = 'none';
    }

    // ===================================================
    // التبديل بين الشاشات
    // ===================================================
    function showScreen(screenKey) {
        Object.values(screens).forEach(s => { if (s) s.classList.remove('active'); });
        if (screens[screenKey]) {
            screens[screenKey].classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (screenKey === 'login') updateInventoryDisplay();
    }

    // ===================================================
    // مؤشر المخزن الحي
    // ===================================================
    function updateInventoryDisplay() {
        const snap = getInventorySnapshot();

        if (inv100El) inv100El.textContent = snap.prize100;
        if (inv200El) inv200El.textContent = snap.prize200;

        if (inv100BarEl) {
            const pct = Math.max(0, Math.min(100, (snap.prize100 / snap.prize100_initial) * 100));
            inv100BarEl.style.width = pct + '%';
        }
        if (inv200BarEl) {
            const pct = Math.max(0, Math.min(100, (snap.prize200 / snap.prize200_initial) * 100));
            inv200BarEl.style.width = pct + '%';
        }
    }
    updateInventoryDisplay();

    // ===================================================
    // شاشة القفل (مشاركة مسبقة)
    // ===================================================
    function hideLockoutScreen() {
        if (alreadyParticipatedBox) alreadyParticipatedBox.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
        loginErrorMsg.style.display = 'none';
        userIdInput.value = '';
        nationalIdInput.value = '';
    }

    function showLockoutScreen(user, historyRecord) {
        loginErrorMsg.style.display = 'none';
        loginForm.style.display = 'none';
        alreadyParticipatedBox.style.display = 'block';

        const firstName = user.name.split(' ')[0] || 'يا بطل';
        lockoutTitle.textContent = `عفواً يا ${firstName}!`;

        const prizeTitleText = historyRecord?.prize?.title || 'تم الكشف مسبقاً';
        const isWin = historyRecord?.prize?.isWinner;
        const dateStr = historyRecord?.formattedDate || 'سابقاً';
        const claimText = historyRecord?.claimInfo
            ? `<div style="margin-top:6px;color:#059669;font-weight:800;">✅ تم التسجيل: ${historyRecord.claimInfo.account} (${historyRecord.claimInfo.method})</div>`
            : '';

        lockoutResultPreview.innerHTML = `
            <div style="font-size:0.95rem;margin-bottom:4px;">
                ${isWin ? '🎁 نتيجتك المسجلة (فائز):' : '💪 نتيجتك المسجلة (حظ أوفر):'}
            </div>
            <div style="font-size:1.2rem;font-weight:900;color:#18181B;">${prizeTitleText}</div>
            <div style="font-size:0.85rem;color:#6B7280;margin-top:6px;">تم السحب بتاريخ: ${dateStr}</div>
            ${claimText}
        `;

        viewPreviousResultBtn.onclick = () => {
            soundManager.playClick();
            currentUser = user;
            currentPrize = historyRecord?.prize;
            handleScratchCompleted(user, true);
        };

        if (lockoutBackBtn) {
            lockoutBackBtn.onclick = () => { soundManager.playClick(); hideLockoutScreen(); };
        }
    }

    // ===================================================
    // 1. تسجيل الدخول
    // ===================================================
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        soundManager.playClick();

        const id = userIdInput.value.trim();
        const nationalId = nationalIdInput.value.trim();
        const user = findUser(id, nationalId);

        if (!user) {
            loginErrorMsg.style.display = 'block';
            loginErrorMsg.classList.remove('shakeError');
            void loginErrorMsg.offsetWidth;
            loginErrorMsg.classList.add('shakeError');
            return;
        }

        if (hasUserParticipated(user.id)) {
            const previousRecord = getUserParticipation(user.id);
            soundManager.playLose();
            showLockoutScreen(user, previousRecord);
            return;
        }

        loginErrorMsg.style.display = 'none';
        currentUser = user;
        soundManager.playSuccessBeep();
        setupWelcomeScreen(user);
    });

    // ===================================================
    // 2. شاشة الترحيب
    // ===================================================
    function setupWelcomeScreen(user) {
        const avatars = ['🦁', '🚀', '👑', '⚡', '🌟', '🦾'];
        welcomeAvatar.textContent = avatars[Math.floor(Math.random() * avatars.length)];
        welcomeGreetingText.innerHTML = `
            أهلاً بيك يا <span class="user-highlight-name">${user.name}</span><br>
            يا بطل العالمية من منطقة <span class="user-highlight-region">${user.region}</span> 🚀👑
        `;
        showScreen('welcome');
        setTimeout(() => soundManager.playWelcome(), 150);
    }

    // ===================================================
    // 3. بدء الخربشة
    // ===================================================
    startScratchBtn.addEventListener('click', () => {
        soundManager.playClick();
        initScratchCard(currentUser);
    });

    function initScratchCard(user) {
        clearRevealTimers();
        currentPrize = getUserPrize(user);

        scratchCardUserName.textContent = user.name;
        scratchCardUserRegion.textContent = user.region;

        prizeIcon.textContent = currentPrize.icon || (currentPrize.isWinner ? '🎁' : '💪');
        prizeTitle.textContent = currentPrize.title;
        prizeDesc.textContent = currentPrize.description;

        scratchPrizeLayer.classList.remove('revealed-clear');
        scratchPrizeLayer.classList.add('mystery-blur');

        hypeIcon.textContent = '🪙';
        hypeMsg.textContent = 'حرّك العملة على الكارت واكتشف سرك...';

        scratchMainCard.classList.remove('in-suspense');
        suspenseOverlay.classList.remove('active');
        scratchCanvas.style.opacity = '1';
        scratchCanvas.style.transform = 'scale(1)';
        scratchCanvas.style.pointerEvents = 'auto';

        if (activeScratchCard) activeScratchCard.destroy();

        showScreen('scratch');
        setTimeout(() => {
            activeScratchCard = new ScratchCard(scratchCanvas, {
                userName: user.name.split(' ')[0],
                threshold: 70,
                brushSize: 34,
                onProgress: (percent) => {
                    if (percent < 25) {
                        hypeIcon.textContent = '🪙';
                        hypeMsg.textContent = 'حرّك العملة على الكارت واكتشف سرك...';
                    } else if (percent < 50) {
                        hypeIcon.textContent = '⚡';
                        hypeMsg.textContent = 'عاش يا بطل! السحر بدأ يظهر.. كمّل!';
                    } else {
                        hypeIcon.textContent = '🔥';
                        hypeMsg.textContent = 'قربت جداً.. لحظة الحسم على وشك البدء!';
                    }
                },
                onSuspense: () => triggerSuspensePhase(user)
            });
        }, 50);
    }

    // ===================================================
    // 4. مرحلة الساسبينس
    // ===================================================
    function triggerSuspensePhase(user) {
        soundManager.playSuspense(2.2);
        scratchMainCard.classList.add('in-suspense');
        suspenseOverlay.classList.add('active');

        const firstName = user.name.split(' ')[0];
        suspenseTitle.textContent = `لحظة الحسم يا ${firstName}! ⚡`;
        suspenseCountdown.textContent = '3';

        setTimeout(() => { suspenseCountdown.textContent = '2'; }, 650);
        setTimeout(() => { suspenseCountdown.textContent = '1'; }, 1300);
        setTimeout(() => { suspenseCountdown.textContent = '💥'; }, 1900);

        setTimeout(() => {
            soundManager.playRevealBlast();
            scratchPrizeLayer.classList.remove('mystery-blur');
            scratchPrizeLayer.classList.add('revealed-clear');
            scratchMainCard.classList.remove('in-suspense');
            suspenseOverlay.classList.remove('active');

            // تسجيل المشاركة فوراً
            recordUserParticipation(user, currentPrize);

            if (currentPrize.isWinner) {
                soundManager.playWin();
                confettiManager.celebrateWin();
                hypeIcon.textContent = '🎉';
                hypeMsg.innerHTML = `🎉 مبروووك كسبت <strong>${currentPrize.title}</strong>!`;
            } else {
                soundManager.playLose();
                hypeIcon.textContent = '💪';
                hypeMsg.innerHTML = `💪 حظك وحش يا نجم.. استنانا في مسابقات جاية!`;
            }

            if (skipToResultBtn) skipToResultBtn.style.display = 'inline-flex';

            revealTransitionTimeout = setTimeout(() => {
                clearRevealTimers();
                handleScratchCompleted(user, false);
            }, 5000);
        }, 2250);
    }

    // ===================================================
    // 5. شاشة النتيجة
    // ===================================================
    function handleScratchCompleted(user, isPreviousView = false) {
        if (!currentPrize) return;

        if (currentPrize.isWinner) {
            if (winnerResultSection) winnerResultSection.style.display = 'block';
            if (hardLuckResultSection) hardLuckResultSection.style.display = 'none';

            resultBigIcon.className = 'result-big-icon';
            resultBigIcon.textContent = currentPrize.icon || '🎁';

            resultMainHeading.innerHTML = `مبروووك المكسب يا <br><span style="color:#059669">${user.name}</span><br> يا بطل العالمية! 🏆🎁🎉`;
            resultPrizeName.textContent = currentPrize.title;
            resultPrizeSub.textContent = currentPrize.description;

            // صورة الجائزة
            if (resultPrizeImage) {
                if (currentPrize.image) {
                    resultPrizeImage.src = currentPrize.image;
                    resultPrizeImage.style.display = 'block';
                } else {
                    resultPrizeImage.style.display = 'none';
                }
            }

            // تحديث حالة نموذج الاستلام المباشر في الصفحة
            const record = getUserParticipation(user.id);
            const claimInputSection = document.getElementById('claimInputSection');
            const claimDoneSection = document.getElementById('claimDoneSection');
            const claimSavedSummary = document.getElementById('claimSavedSummary');

            if (record?.claimInfo) {
                if (claimInputSection) claimInputSection.style.display = 'none';
                if (claimDoneSection) claimDoneSection.style.display = 'block';
                if (claimSavedSummary) {
                    claimSavedSummary.innerHTML = `
                        <div>طريقة الاستلام: <span style="color:#10b981;">${record.claimInfo.method}</span></div>
                        <div style="margin-top:4px;">رقم الحساب / المحفظة: <span style="color:#FFE500; font-size:1.15rem;">${record.claimInfo.account}</span></div>
                        <div style="font-size:0.8rem; color:#6b7280; margin-top:4px;">تاريخ التسجيل: ${record.claimInfo.formattedDate || ''}</div>
                    `;
                }
            } else {
                if (claimInputSection) claimInputSection.style.display = 'block';
                if (claimDoneSection) claimDoneSection.style.display = 'none';
                const accInput = document.getElementById('payoutAccountInput');
                if (accInput) accInput.value = '';
            }

            if (!isPreviousView) {
                soundManager.playWin();
                confettiManager.celebrateWin();
            }
        } else {
            if (winnerResultSection) winnerResultSection.style.display = 'none';
            if (hardLuckResultSection) hardLuckResultSection.style.display = 'block';
            if (!isPreviousView) soundManager.playLose();
        }

        updateInventoryDisplay();
        showScreen('result');
    }

    // زر "تخطي إلى النتيجة"
    if (skipToResultBtn) {
        skipToResultBtn.addEventListener('click', () => {
            soundManager.playClick();
            clearRevealTimers();
            handleScratchCompleted(currentUser, false);
        });
    }

    // ===================================================
    // 6. التحكم في وسيلة الاستلام المباشرة في الصفحة
    // ===================================================
    const payoutMethodChips = document.querySelectorAll('#payoutMethodSelector .method-chip');
    const accountInputLabel = document.getElementById('accountInputLabel');
    const payoutAccountInput = document.getElementById('payoutAccountInput');

    payoutMethodChips.forEach(chip => {
        chip.addEventListener('click', () => {
            payoutMethodChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const radio = chip.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                const method = radio.value;
                if (method.includes('انستاباي') || method.includes('InstaPay')) {
                    if (accountInputLabel) accountInputLabel.textContent = 'عنوان انستاباي (IPA) أو رقم الموبايل:';
                    if (payoutAccountInput) payoutAccountInput.placeholder = 'name@instapay أو 01xxxxxxxxx';
                } else {
                    if (accountInputLabel) accountInputLabel.textContent = `رقم محفظة ${method} (01xxxxxxxxx):`;
                    if (payoutAccountInput) payoutAccountInput.placeholder = '01xxxxxxxxx';
                }
            }
        });
    });

    // تأكيد إرسال بيانات الاستلام وحفظها فورياً
    const directClaimForm = document.getElementById('directClaimForm');
    if (directClaimForm) {
        directClaimForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentUser) return;
            const accountVal = payoutAccountInput ? payoutAccountInput.value.trim() : '';
            if (!accountVal) {
                if (payoutAccountInput) payoutAccountInput.focus();
                return;
            }

            const selectedRadio = document.querySelector('input[name="directPayoutMethod"]:checked');
            const selectedMethod = selectedRadio ? selectedRadio.value : 'فودافون كاش';

            soundManager.playSuccessBeep();
            confettiManager.celebrateWin();

            // حفظ بيانات الاستلام
            const history = getAllParticipations();
            const now = new Date();
            const claimInfo = {
                method: selectedMethod,
                account: accountVal,
                submittedAt: now.toISOString(),
                formattedDate: new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(now)
            };

            if (history[currentUser.id]) {
                history[currentUser.id].claimInfo = claimInfo;
            } else {
                history[currentUser.id] = {
                    userId: currentUser.id,
                    nationalId: currentUser.nationalId,
                    userName: currentUser.name,
                    userRegion: currentUser.region,
                    prize: currentPrize,
                    scratchedAt: now.toISOString(),
                    formattedDate: new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(now),
                    claimInfo: claimInfo
                };
            }

            try {
                localStorage.setItem(PARTICIPATION_STORAGE_KEY, JSON.stringify(history));
            } catch (err) {
                console.warn(err);
            }

            // إرسال سحابي فوري في الخلفية للشيت المركزي
            syncToCloud({
                action: 'claim',
                userId: currentUser.id,
                claimInfo: claimInfo
            });

            // تحديث العرض فورياً
            const claimInputSection = document.getElementById('claimInputSection');
            const claimDoneSection = document.getElementById('claimDoneSection');
            const claimSavedSummary = document.getElementById('claimSavedSummary');

            if (claimInputSection) claimInputSection.style.display = 'none';
            if (claimDoneSection) claimDoneSection.style.display = 'block';
            if (claimSavedSummary) {
                claimSavedSummary.innerHTML = `
                    <div>طريقة الاستلام: <span style="color:#10b981;">${selectedMethod}</span></div>
                    <div style="margin-top:4px;">رقم الحساب / المحفظة: <span style="color:#FFE500; font-size:1.15rem;">${accountVal}</span></div>
                    <div style="font-size:0.8rem; color:#6b7280; margin-top:4px;">تاريخ التسجيل: ${claimInfo.formattedDate}</div>
                `;
            }
        });
    }

    // الخروج والتصفير
    logoutBtn.addEventListener('click', () => {
        soundManager.playClick();
        clearRevealTimers();
        currentUser = null;
        currentPrize = null;
        hideLockoutScreen();
        showScreen('login');
    });

    // زر تصفير التجربة (للمطور فقط)
    if (devResetStorageBtn) {
        devResetStorageBtn.addEventListener('click', () => {
            soundManager.playClick();
            if (resetParticipationsStorage()) {
                hideLockoutScreen();
                alert('🔄 تم تصفير سجل المشاركات بنجاح!\nيمكنك الآن إعادة تجربة أي حساب من البداية.');
            }
        });
    }

    // ===================================================
    // 7. العملة التفاعلية التي تتبع الماوس داخل الكارت
    // ===================================================
    if (scratchContainer && coinCursorTool) {
        scratchContainer.addEventListener('mouseenter', () => { coinCursorTool.style.display = 'block'; });
        scratchContainer.addEventListener('mouseleave', () => { coinCursorTool.style.display = 'none'; });
        scratchContainer.addEventListener('mousemove', (e) => {
            const rect = scratchContainer.getBoundingClientRect();
            coinCursorTool.style.left = `${e.clientX - rect.left}px`;
            coinCursorTool.style.top = `${e.clientY - rect.top}px`;
        });
    }

    // أزرار الصوت والمساعدة
    soundToggleBtn.addEventListener('click', () => {
        const isEnabled = soundManager.toggleMute();
        soundToggleBtn.textContent = isEnabled ? '🔊' : '🔇';
    });

    helpInfoBtn.addEventListener('click', () => {
        soundManager.playClick();
        alert('🎉 مرحباً بك في مسابقة بطل العالمية اكسبريس!\n\n1. اكتب كود الموظف والرقم القومي.\n2. استلم الترحيب الملوكي.\n3. خربش 70% من الكارت بالعملة لاكتشاف نتيجتك!\n4. إذا كنت فائزاً، اضغط زر الاستلام ثم اتبع التعليمات.\n\n⚠️ ملحوظة: كل متسابق له فرصة واحدة فقط للخربشة.\n\nبالتوفيق يا عالمي! 🌟');
    });
});
