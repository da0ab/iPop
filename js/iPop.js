class VideoService {
    static YOUTUBE = "YouTube";
    static RUTUBE = "RuTube";
    static VK = "VK";

    static detectService(url) {
        if (url.includes("youtu.be") || url.includes("youtube.com")) {
            return VideoService.YOUTUBE;
        } else if (url.includes("rutube.ru")) {
            return VideoService.RUTUBE;
        } else if (url.includes("vk.com")) {
            return VideoService.VK;
        } else {
            return "Unknown";
        }
    }
}

function iPop() {
    let ip = this;

    this.init = function() {
        let iPopElements = document.querySelectorAll('.iPop-img, .iPop-video, .iPop-iframe');
        for (let i = 0; i < iPopElements.length; i++) {
            let element = iPopElements[i];
            ip.generatePreview(element);
            element.addEventListener('click', function(e) {
                e.preventDefault();
                ip.iPop('', this);
            });
        }

        let iPopLinks = document.querySelectorAll('.iPop-up');
        for (let i = 0; i < iPopLinks.length; i++) {
            let link = iPopLinks[i];
            link.addEventListener('click', function(e) {
                e.preventDefault();
                ip.handlePopupContent(this);
            });
        }

        document.body.addEventListener('keyup', function(e) { ip.onKeyup(e); });
    };

    this.onKeyup = function(e) {
        let iPopImg = document.querySelector('.iPopImg');
        if (!iPopImg) return;
        let iPopImgSrc = iPopImg.getAttribute('src');
        let nextPrevItem = document.querySelector(`.iPop-img[href="${iPopImgSrc}"]`);
        if (e.keyCode === 39) { // Next
            ip.iPopNextPrevItem(nextPrevItem, true);
        }
        if (e.keyCode === 37) { // Prev
            ip.iPopNextPrevItem(nextPrevItem, false);
        }
        if (e.keyCode === 27) { // Esc
            ip.closeIpop();
        }
    };

    this.handlePopupContent = function(link) {
        let targetId = link.getAttribute('href').substring(1); // Remove #
        let contentDiv = document.getElementById(targetId);

        if (contentDiv) {
            let html = `<div class="iPopOverlay active">
                <button type="button" class="closeIpop" title="Close"></button>
                <div class="iPopFrame">${contentDiv.outerHTML}</div>
            </div>`;

            let fragment = document.createRange().createContextualFragment(html);
            document.body.appendChild(fragment);

            document.querySelector('.closeIpop').addEventListener('click', function() {
                ip.closeIpop();
            });
        }
    };

    this.onIpopOpen = function(cb) {
        return cb && typeof cb === 'function' && cb();
    };

    this.onIpopClose = function(cb) {
        return cb && typeof cb === 'function' && cb();
    };

    this.onNextItemClick = function(cb) {
        return cb && typeof cb === 'function' && cb();
    };

    this.onPrevItemClick = function(cb) {
        return cb && typeof cb === 'function' && cb();
    };

    this.iPop = function(code, el) {
        let iPopClass = '', hasSelf = true, url = "", html = '';
        if (typeof el == 'undefined') {
            hasSelf = false;
        }
        if (hasSelf) {
            iPopClass = el.getAttribute('data-iPop-class') ? el.getAttribute('data-iPop-class') : '';
            url = el.getAttribute('href');
        }
        html = document.createRange().createContextualFragment(`<div class="iPopOverlay">
                    <button type="button" class="closeIpop" title="Close"></button>
                    <div class="iPopFrame ${iPopClass}"></div>
                </div>`);

        document.addEventListener('click', function(e) {
            if (e.target.className == 'iPopOverlay active' || e.target.className == 'closeIpop') {
                ip.closeIpop();
            }
        });

        let placeHolderEl = document.querySelector('.iPopPlaceHolder');
        if (!document.querySelector('.iPopFrame')) {
            document.body.appendChild(html);
            ip.insertIpopHtml(el, hasSelf, url, code, function() {
                setTimeout(function() {
                    document.querySelector('.iPopOverlay').classList.add('active');
                }, 200);
                ip.onIpopOpen();
            });
        } else {
            let iPopFrame = document.querySelector('.iPopFrame');
            iPopFrame.innerHTML = '';
            ip.insertIpopHtml(el, hasSelf, url, code, function() {
                ip.onIpopOpen();
            });
        }
    };

    this.insertIpopHtml = function(el, hasSelf, url, code, cb) {
        let iPopFrame = document.querySelector('.iPopFrame'),
            placeHolderEl = document.querySelector('.iPopPlaceHolder');

        if (hasSelf) {
            if (el.classList.contains('iPop-iframe')) {
                // Direct iframe handling
                iPopFrame.innerHTML = `<iframe src="${url}" frameborder="0" allow="autoplay; encrypted-media; fullscreen;"></iframe>`;
            } else {
                let service = VideoService.detectService(url);
                if (service !== "Unknown") { // Video
                    if (service === VideoService.YOUTUBE) {
                        let urlObj = new URL(url);
                        let youtube_id = '';

                        if (urlObj.hostname === 'youtu.be') {
                            youtube_id = urlObj.pathname.slice(1);
                        } else if (urlObj.hostname.includes('youtube.com')) {
                            youtube_id = urlObj.searchParams.get('v') || urlObj.pathname.split('/').pop();
                        }

                        let embedUrl = new URL(`https://www.youtube.com/embed/${youtube_id}`);
                        embedUrl.searchParams.set('wmode', 'transparent');
                        embedUrl.searchParams.set('rel', '0');
                        embedUrl.searchParams.set('autoplay', '1');

                        if (urlObj.searchParams.get('t')) {
                            embedUrl.searchParams.set('start', urlObj.searchParams.get('t').replace('s', ''));
                        }

                        url = embedUrl.toString();
                    } else if (service === VideoService.VK) { // VK
                        let vk_id = url.match(/video(-?\d+)_(\d+)/);
                        if (vk_id) {
                            let vk_url = `https://vk.com/video_ext.php?oid=${vk_id[1]}&id=${vk_id[2]}`;
                            url = vk_url;
                        }
                    } else if (service === VideoService.RUTUBE) { // RuTube
                        url = `https://rutube.ru/play/embed/${new URL(url).pathname.split('/')[2]}`;
                    }

                    iPopFrame.innerHTML = `<iframe src="${url}" frameborder="0" allow="autoplay; encrypted-media; fullscreen;"></iframe>`;
                } else if (url.indexOf('#') == -1) { // Image


                    let iPopImg = document.querySelector('.iPopImg');
                    if (iPopImg) {
                        iPopFrame.appendChild(document.createRange().createContextualFragment('<div class="iPopLoader"></div>'));
                    } else {
                        iPopFrame.appendChild(document.createRange().createContextualFragment('<div class="iPopLoader"></div>'));
                    }

                    let img = new Image();
                    img.src = url;
                    img.className = 'iPopImg';
                    img.onload = function() {
                        let code = `<img src="${url}" alt="" class="iPopImg">`;
                        let group = el.getAttribute('data-iPop-group');
                        if (group && document.querySelector(`.iPop-img[data-iPop-group="${group}"]`)) {
                            code = `<button type="button" class="iPopNextImg" title="Next"></button>${code}<button type="button" class="iPopPrevImg" title="Prev"></button>`;
                        }
                        iPopFrame.innerHTML = code;
                        document.querySelector('.iPopNextImg').addEventListener('click', function() {
                            ip.iPopNextPrevItem(el, true);
                        });
                        document.querySelector('.iPopPrevImg').addEventListener('click', function() {
                            ip.iPopNextPrevItem(el, false);
                        });
                    };
                }
            }
        } else {
            iPopFrame.innerHTML = code;
        }
        cb && cb();
    };

    this.iPopNextPrevItem = function(el, isNext) {
        let group = el.getAttribute('data-iPop-group');
        let targetIndex;
        let groups = document.querySelectorAll(`.iPop-img[data-iPop-group="${group}"]`);
        for (let i = 0; i < groups.length; i++) {
            let current = groups[i];
            if (current.getAttribute('href') == el.getAttribute('href')) {
                if (isNext) {
                    targetIndex = i + 1 < groups.length ? i + 1 : 0;
                } else {
                    targetIndex = i - 1 >= 0 ? i - 1 : groups.length - 1;
                }
                break;
            }
        }
        let target = groups[targetIndex];
        if (target) {
            target.click();
            isNext ? ip.onNextItemClick() : ip.onPrevItemClick();
        }
    };

    this.closeIpop = function() {
        let iPopOverlay = document.querySelector('.iPopOverlay'),
            iPopFrame = document.querySelector('.iPopFrame'),
            iPopPlaceHolder = document.querySelector('.iPopPlaceHolder');

        iPopOverlay.classList.remove('active');
        setTimeout(function() {
            if (iPopPlaceHolder && iPopPlaceHolder.parentNode) {
                iPopPlaceHolder.appendChild(document.createRange().createContextualFragment(iPopFrame.innerHTML));
                iPopPlaceHolder.parentNode.removeChild(iPopPlaceHolder);
            }
            iPopOverlay && iPopOverlay.parentNode && iPopOverlay.parentNode.removeChild(iPopOverlay);
            ip.onIpopClose();
        }, 600);
    };

    this.generatePreview = function(element) {
        if (element.querySelector('img')) {
            return; // Skip if an image already exists
        }

        let url = element.href;
        let service = VideoService.detectService(url);
        if (service === VideoService.YOUTUBE) {
            let urlObj = new URL(url);
            let idYoutube = urlObj.hostname === 'youtu.be' ? urlObj.pathname.replace('/', '') : urlObj.searchParams.get('v');
            if (idYoutube) {
                let theImg = element.classList.contains("Ytube-mini")
                    ? `https://img.youtube.com/vi/${idYoutube}/mqdefault.jpg`
                    : `https://img.youtube.com/vi/${idYoutube}/maxresdefault.jpg`;
                element.innerHTML += `<img src="${theImg}" alt="YouTube Preview">`;
            }
        } else if (service === VideoService.RUTUBE) {
            let idRutube = new URL(url).pathname.split('/').filter(Boolean).pop();
            if (idRutube) {
                let theImg = `https://preview.rutube.ru/preview/${idRutube}.webp`;
                element.innerHTML += `<img src="${theImg}" alt="RuTube Preview">`;
            }
        }
    };
};

document.addEventListener('DOMContentLoaded', function() {
    let myIpop;
    if (document.querySelector('.iPop-img, .iPop-video, .iPop-iframe')) {
        myIpop = new iPop();
        myIpop.init();
    }
});

