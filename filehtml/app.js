// ==========================================
// FC HUB - PREMIUM APPLICATION SCRIPT (app.js)
// Tích hợp Hiệu ứng 3D, Động lực học & Tối ưu UI
// ==========================================

// --- 0. TỰ ĐỘNG TIÊM CSS HIỆU ỨNG (Không cần sửa file CSS cũ) ---
function injectAdvancedAnimations() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* Khung chứa thẻ để làm hiệu ứng 3D */
        .player-card {
            transform-style: preserve-3d;
            will-change: transform;
            position: relative;
            z-index: 1;
        }
        /* Hiệu ứng trượt lên mượt mà */
        .card-enter {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
        }
        /* Glassmorphism cho Modal */
        #playerModal {
            transition: opacity 0.4s ease, backdrop-filter 0.4s ease;
            backdrop-filter: blur(8px);
            background: rgba(0,0,0,0.6) !important;
        }
        #modal-body {
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.2);
            border: 1px solid rgba(16, 185, 129, 0.3);
            background: linear-gradient(145deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.95) 100%);
        }
        /* Toast Alert Premium */
        #toast {
            position: fixed;
            bottom: 30px;
            right: -300px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #fff;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(16,185,129,0.4);
            font-weight: 600;
            transition: right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #toast.show { right: 30px; }
        /* So sánh Progress Bar */
        .stat-bar-bg {
            width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-top: 4px; overflow: hidden;
        }
        .stat-bar-fill {
            height: 100%; width: 0%; background: #10b981; border-radius: 4px; transition: width 1.5s cubic-bezier(0.22, 1, 0.36, 1);
        }
    `;
    document.head.appendChild(style);
}

// --- 1. DỮ LIỆU CẦU THỦ ---
const playersData = [
    { id: 1, name: "Kylian Mbappé", pos: "ST", rating: 97, pace: 99, shooting: 94, passing: 83, price: "2.4B", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Kylian_Mbapp%C3%A9_2018.jpg?width=300" },
    { id: 2, name: "Jude Bellingham", pos: "CM", rating: 96, pace: 88, shooting: 89, passing: 92, price: "1.9B", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Jude_Bellingham_2022_%28cropped%29.jpg?width=300" },
    { id: 3, name: "Virgil van Dijk", pos: "CB", rating: 95, pace: 82, shooting: 60, passing: 78, price: "1.2B", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Virgil_van_Dijk_2019.jpg?width=300" },
    { id: 4, name: "Kevin De Bruyne", pos: "CM", rating: 96, pace: 76, shooting: 88, passing: 98, price: "1.5B", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Kevin_De_Bruyne_2018.jpg?width=300" },
    { id: 5, name: "Thibaut Courtois", pos: "GK", rating: 95, pace: 50, shooting: 20, passing: 70, price: "950M", img: "https://image.sggp.org.vn/w1000/Uploaded/2026/dqmbbcvo/2025_06_22/thibaut-courtois1-8095-6193.jpg.webp" },
    { id: 6, name: "Vinícius Jr.", pos: "LW", rating: 96, pace: 98, shooting: 90, passing: 85, price: "2.1B", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo726OQpgG0vlcUoMFgmUwV95Hvgpsjw6LqzIHTMUKBkMoY5RcClb2_8o&s=10" },
    { id: 7, name: "Lionel Messi", pos: "RW", rating: 97, pace: 85, shooting: 96, passing: 98, price: "2.5B", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Lionel_Messi_20180626.jpg?width=300" },
    { id: 8, name: "Cristiano Ronaldo", pos: "ST", rating: 95, pace: 86, shooting: 97, passing: 80, price: "2.0B", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Cristiano_Ronaldo_2018.jpg?width=300" },
    { id: 9, name: "Erling Haaland", pos: "ST", rating: 97, pace: 94, shooting: 98, passing: 70, price: "2.3B", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Erling_Haaland_2023_%28cropped%29.jpg?width=300" },
    { id: 10, name: "Rodri", pos: "CDM", rating: 96, pace: 70, shooting: 82, passing: 94, price: "1.4B", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Rodri_2023.jpg?width=300" },
    { id: 11, name: "William Saliba", pos: "CB", rating: 94, pace: 85, shooting: 40, passing: 75, price: "1.1B", img: "https://commons.wikimedia.org/wiki/Special:FilePath/William_Saliba_2023.jpg?width=300" },
    { id: 12, name: "Alisson Becker", pos: "GK", rating: 94, pace: 52, shooting: 25, passing: 78, price: "900M", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Alisson_Becker_2018.jpg?width=300" },
    { id: 13, name: "Bukayo Saka", pos: "RW", rating: 94, pace: 92, shooting: 86, passing: 88, price: "1.3B", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Bukayo_Saka_2022.jpg?width=300" },
    { id: 14, name: "Phil Foden", pos: "CAM", rating: 95, pace: 89, shooting: 88, passing: 91, price: "1.6B", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Phil_Foden_2022.jpg?width=300" },
    { id: 15, name: "Theo Hernández", pos: "LB", rating: 93, pace: 96, shooting: 75, passing: 83, price: "950M", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Theo_Hern%C3%A1ndez_2022.jpg?width=300" },
    { id: 16, name: "Trent Alexander-Arnold", pos: "RB", rating: 93, pace: 82, shooting: 80, passing: 94, price: "850M", img: "https://commons.wikimedia.org/wiki/Special:FilePath/Trent_Alexander-Arnold_2020.jpg?width=300" }
];
const fallbackImg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 24 24' fill='%2310b981'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";

// --- 2. HỆ THỐNG HIỆU ỨNG (ANIMATIONS & 3D) ---
// Đếm số mượt mà
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        obj.innerHTML = Math.floor(ease * (end - start) + start);
        if (progress < 1) window.requestAnimationFrame(step);
        else obj.innerHTML = end;
    };
    window.requestAnimationFrame(step);
}

// Staggered Entrance cho Grid
function animateCardsEntrance() {
    const cards = document.querySelectorAll('.player-card');
    cards.forEach((card, index) => {
        card.classList.add('card-enter');
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 60); // Xuất hiện lần lượt cách nhau 60ms
    });
    // Kích hoạt 3D Hover sau khi load xong
    setTimeout(init3DTilt, cards.length * 60 + 300);
}

// 3D Tilt Effect cho thẻ cầu thủ (Giống game FC)
function init3DTilt() {
    const cards = document.querySelectorAll('.player-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            // Tính toán góc nghiêng (tối đa 12 độ)
            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease-out';
            card.style.boxShadow = `${-rotateY}px ${rotateX}px 20px rgba(16,185,129,0.2)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.boxShadow = 'none';
        });
    });
}

// --- 3. TIỆN ÍCH & AUTH GUARD ---
function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>⚡</span> ${message}`;
    // Reset animation if triggered quickly
    toast.className = toast.className.replace("show", "");
    void toast.offsetWidth; // trigger reflow
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}

function checkAuthGuard() {
    const path = window.location.pathname.toLowerCase();
    const isFreePage = path.endsWith('index.html') || path.endsWith('/') || path === '' || 
                       path.endsWith('login.html') || path.endsWith('signup.html') || path.endsWith('contact.html');
    if (!isFreePage && !localStorage.getItem('fc_current_user')) {
        showToast("Yêu cầu đăng nhập để truy cập!");
        setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    }
}

// --- 4. RENDER THỊ TRƯỜNG & THEO DÕI ---
function getShortlist() { return JSON.parse(localStorage.getItem('fc_shortlist')) || []; }
function saveShortlist(list) { localStorage.setItem('fc_shortlist', JSON.stringify(list)); }

function toggleShortlist(id, btnElement) {
    let shortlist = getShortlist();
    const index = shortlist.indexOf(id);
    
    // Nút bấm có hiệu ứng giật nhẹ
    btnElement.style.transform = 'scale(0.9)';
    setTimeout(() => btnElement.style.transform = 'scale(1)', 150);

    if (index > -1) {
        shortlist.splice(index, 1);
        showToast("Đã xóa khỏi danh sách theo dõi!");
    } else {
        shortlist.push(id);
        showToast("Đã thêm vào danh sách theo dõi!");
    }
    saveShortlist(shortlist);
    
    // Render lại nhưng giữ nguyên vị trí cuộn trang
    if (document.getElementById('market-grid')) filterAndRenderMarket(false);
    if (document.getElementById('shortlist-grid')) renderShortlist();
}

function filterAndRenderMarket(animate = true) {
    const grid = document.getElementById('market-grid');
    if (!grid) return;

    const keyword = document.getElementById('search-input')?.value.toLowerCase() || "";
    const selectedPos = document.getElementById('pos-select')?.value || "";
    const sortBy = document.getElementById('sort-select')?.value || "desc";

    let filtered = playersData.filter(p => p.name.toLowerCase().includes(keyword) && (selectedPos === "" || p.pos === selectedPos));
    filtered.sort((a, b) => sortBy === "desc" ? b.rating - a.rating : a.rating - b.rating);

    const shortlist = getShortlist();

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: rgba(255,255,255,0.5);"><h2>Kho dữ liệu không có cầu thủ này!</h2></div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="player-card">
            <div class="player-avatar-wrapper" style="overflow: visible;">
                <img src="${p.img}" alt="${p.name}" class="player-avatar" onerror="this.src='${fallbackImg}'" style="box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);">
            </div>
            <div class="player-name">${p.name}</div>
            <div class="player-pos" style="color: #10b981; font-weight: bold; text-shadow: 0 0 10px rgba(16,185,129,0.4);">${p.pos} • OVR ${p.rating}</div>
            <div class="player-stats">
                <span>PAC: <b>${p.pace}</b></span>
                <span>SHO: <b>${p.shooting}</b></span>
                <span>PAS: <b>${p.passing}</b></span>
            </div>
            <div class="player-price" style="margin-top: 10px; font-size: 1.1rem; color: #fff;">💎 ${p.price}</div>
            <div class="card-actions" style="margin-top: 15px;">
                <button class="btn btn-outline" onclick="openPlayerModal(${p.id})">Chi tiết</button>
                <button class="btn ${shortlist.includes(p.id) ? 'btn-danger' : 'btn-primary'}" onclick="toggleShortlist(${p.id}, this)">
                    ${shortlist.includes(p.id) ? 'Bỏ theo dõi' : 'Theo dõi'}
                </button>
            </div>
        </div>
    `).join('');

    if (animate) animateCardsEntrance();
    else init3DTilt(); // Nếu ko animate (chỉ update nút theo dõi), thì re-init 3D
}

function renderShortlist() {
    const grid = document.getElementById('shortlist-grid');
    if (!grid) return;
    const shortlistIds = getShortlist();
    const savedPlayers = playersData.filter(p => shortlistIds.includes(p.id));

    if (savedPlayers.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem;"><h2>Danh sách trống</h2><p style="color: #9ca3af;">Hãy dạo chợ và tìm kiếm siêu sao cho đội bóng của bạn.</p></div>`;
        return;
    }
    
    grid.innerHTML = savedPlayers.map(p => `
        <div class="player-card">
            <div class="player-avatar-wrapper"><img src="${p.img}" class="player-avatar" onerror="this.src='${fallbackImg}'"></div>
            <div class="player-name">${p.name}</div>
            <div class="player-pos">${p.pos} • OVR ${p.rating}</div>
            <div class="player-price">💎 ${p.price}</div>
            <div class="card-actions" style="margin-top: 15px;">
                <button class="btn btn-outline" onclick="openPlayerModal(${p.id})">Chi tiết</button>
                <button class="btn btn-danger" onclick="toggleShortlist(${p.id}, this)">Loại bỏ</button>
            </div>
        </div>
    `).join('');
    animateCardsEntrance();
}

// --- 5. MODAL MƯỢT MÀ VÀ SỐ NHẢY ĐỘNG ---
function openPlayerModal(id) {
    const player = playersData.find(p => p.id === id);
    const modal = document.getElementById('playerModal');
    const modalBody = document.getElementById('modal-body');
    if (!player || !modal || !modalBody) return;

    modalBody.innerHTML = `
        <div style="text-align: center; position: relative;">
            <div class="player-avatar-wrapper" style="width: 120px; height: 120px; margin: 0 auto 1.5rem auto;">
                <img src="${player.img}" class="player-avatar" onerror="this.src='${fallbackImg}'" style="border: 3px solid #10b981; box-shadow: 0 0 20px rgba(16,185,129,0.5);">
            </div>
            <h2 style="color: #fff; margin-bottom: 0.5rem; font-size: 1.8rem; letter-spacing: 1px;">${player.name}</h2>
            <p style="color: #10b981; font-weight: 800; font-size: 1.2rem; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 2px;">
                ${player.pos} • OVR <span class="anim-num" data-val="${player.rating}">0</span>
            </p>
            <div style="display: flex; flex-direction: column; gap: 1rem; text-align: left; background: rgba(0,0,0,0.5); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                    <span style="color: #9ca3af;">Tốc độ (Pace)</span> <b style="font-size: 1.1rem;" class="anim-num" data-val="${player.pace}">0</b>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                    <span style="color: #9ca3af;">Sút bóng (Shoot)</span> <b style="font-size: 1.1rem;" class="anim-num" data-val="${player.shooting}">0</b>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                    <span style="color: #9ca3af;">Chuyền (Pass)</span> <b style="font-size: 1.1rem;" class="anim-num" data-val="${player.passing}">0</b>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
                    <span style="color: #9ca3af;">Định giá TTCN</span> <b style="color: #10b981; font-size: 1.2rem;">💎 ${player.price}</b>
                </div>
            </div>
        </div>
    `;
    
    // Reset CSS trạng thái mờ
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    modalBody.style.opacity = '0';
    modalBody.style.transform = 'scale(0.8) translateY(30px)';
    
    // Kích hoạt Animation Fade-in & Scale-up
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modalBody.style.opacity = '1';
        modalBody.style.transform = 'scale(1) translateY(0)';
    });

    // Kích hoạt Animation nhảy số
    setTimeout(() => {
        document.querySelectorAll('.anim-num').forEach(el => {
            const target = parseInt(el.getAttribute('data-val'));
            animateValue(el, 0, target, 1200); // Chạy trong 1.2 giây
        });
    }, 200);
}

function closeModal() {
    const modal = document.getElementById('playerModal');
    const modalBody = document.getElementById('modal-body');
    // Animation Fade-out
    modal.style.opacity = '0';
    modalBody.style.transform = 'scale(0.9) translateY(20px)';
    modalBody.style.opacity = '0';
    setTimeout(() => { modal.style.display = 'none'; }, 400);
}
window.onclick = function(event) {
    if (event.target === document.getElementById('playerModal')) closeModal();
}

// --- 6. TRANG SO SÁNH VỚI ANIMATION PROGRESS BAR ---
function initComparePage() {
    ['player1-select', 'player2-select'].forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.innerHTML = `<option value="">-- Chọn danh thủ --</option>` + 
                playersData.map(p => `<option value="${p.id}">${p.name} (${p.pos} ${p.rating})</option>`).join('');
            el.addEventListener('change', updateCompareResult);
        }
    });
}

function updateCompareResult() {
    const id1 = document.getElementById('player1-select').value;
    const id2 = document.getElementById('player2-select').value;
    const resultWrapper = document.getElementById('compare-result');

    if (!id1 || !id2) return;
    if (id1 === id2) {
        resultWrapper.innerHTML = `<p style="text-align: center; color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 8px;">Vui lòng chọn 2 cầu thủ khác biệt!</p>`;
        return;
    }

    const p1 = playersData.find(p => p.id == id1);
    const p2 = playersData.find(p => p.id == id2);

    // Render HTML có sẵn Progress Bar rỗng (0%)
    resultWrapper.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            ${[p1, p2].map(p => `
                <div style="background: linear-gradient(180deg, rgba(30,30,30,0.8) 0%, rgba(10,10,10,0.9) 100%); padding: 2rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <img src="${p.img}" onerror="this.src='${fallbackImg}'" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; border: 3px solid #10b981; padding: 3px;">
                    <h3 style="color: #fff; margin-bottom: 0.25rem; font-size: 1.5rem;">${p.name}</h3>
                    <p style="color: #10b981; font-weight: 800; font-size: 1.2rem; margin-bottom: 1.5rem;">OVR ${p.rating}</p>
                    
                    <div style="text-align: left; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;"><span>Tốc độ (Pace)</span> <b>${p.pace}</b></div>
                        <div class="stat-bar-bg"><div class="stat-bar-fill stat-fill-anim" data-width="${p.pace}%"></div></div>
                    </div>
                    
                    <div style="text-align: left; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;"><span>Sút bóng (Shoot)</span> <b>${p.shooting}</b></div>
                        <div class="stat-bar-bg"><div class="stat-bar-fill stat-fill-anim" data-width="${p.shooting}%"></div></div>
                    </div>
                    
                    <div style="text-align: left; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;"><span>Chuyền bóng (Pass)</span> <b>${p.passing}</b></div>
                        <div class="stat-bar-bg"><div class="stat-bar-fill stat-fill-anim" data-width="${p.passing}%"></div></div>
                    </div>
                    
                    <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1);">
                        <b style="color: #10b981; font-size: 1.3rem;">💎 ${p.price}</b>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Kích hoạt Animation thanh Progress Bar chạy mượt mà
    setTimeout(() => {
        document.querySelectorAll('.stat-fill-anim').forEach(bar => {
            bar.style.width = bar.getAttribute('data-width');
            // Đổi màu nếu chỉ số siêu việt (>90)
            if(parseInt(bar.getAttribute('data-width')) > 90) {
                bar.style.background = 'linear-gradient(90deg, #10b981 0%, #34d399 100%)';
                bar.style.boxShadow = '0 0 10px #10b981';
            }
        });
    }, 100);
}

// --- 7. FORM AUTH & CONTACT ---
function handleSignup(e) { /* Giữ nguyên hệ thống cũ */ }
function handleLogin(e) { /* Giữ nguyên hệ thống cũ */ }
function handleContactSubmit(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button');
    btn.innerHTML = "Đang gửi...";
    btn.style.opacity = '0.7';
    setTimeout(() => {
        showToast("Tuyệt vời! Tin nhắn đã được gửi thành công.");
        event.target.reset();
        btn.innerHTML = "Gửi Tin Nhắn";
        btn.style.opacity = '1';
    }, 1000); // Giả lập loading delay 1s
}

// --- 8. KHỞI TẠO HỆ THỐNG ---
document.addEventListener('DOMContentLoaded', () => {
    injectAdvancedAnimations(); // Bơm CSS Hiệu ứng ngay lập tức
    checkAuthGuard();
    
    // Nếu ở trang thị trường
    if(document.getElementById('market-grid')) {
        ['search-input', 'pos-select', 'sort-select'].forEach(id => {
            document.getElementById(id)?.addEventListener(id === 'search-input' ? 'input' : 'change', filterAndRenderMarket);
        });
        filterAndRenderMarket(true);
    }
    
    if(document.getElementById('shortlist-grid')) renderShortlist();
    if(document.getElementById('player1-select')) initComparePage();
})// --- 10. HỆ THỐNG FILTER TIN TỨC (NEWS PAGE) ---
function initNewsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-card');

    if (filterBtns.length === 0) return; // Nếu không ở trang News thì bỏ qua

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Xóa class active ở tất cả nút
            filterBtns.forEach(b => b.classList.remove('active'));
            // Thêm class active cho nút vừa bấm
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Ẩn/Hiện bài viết mượt mà
            newsCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    // Tạo hiệu ứng fade in nhẹ khi hiện lại
                    card.style.animation = 'none';
                    card.offsetHeight; // trigger reflow
                    card.style.animation = 'slideInLeft 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Bổ sung gọi hàm vào sự kiện DOMContentLoaded hiện có ở app.js
document.addEventListener('DOMContentLoaded', () => {
    initNewsFilter(); // Chạy bộ lọc tin tức
});