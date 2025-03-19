class VideoService {
    static YOUTUBE = "YouTube";
    static RUTUBE = "RuTube";
    static VK = "VK";
    static UNKNOWN = "Unknown";
    static detectService(url) {
        if (typeof url !== 'string' || !url) {
            return this.UNKNOWN;
        }
        if (url.includes("youtu.be") || url.includes("youtube.com")) {
            return this.YOUTUBE;
        } else if (url.includes("rutube.ru")) {
            return this.RUTUBE;
        } else if (url.includes("vk.com") || url.includes("vkvideo.ru")) {
            return this.VK;
        } else {
            return this.UNKNOWN;
        }
    }
    static getServiceDetails(url, className) {
        const service = this.detectService(url);
        switch (service) {
            case this.YOUTUBE:
                return this.getYouTubeDetails(url, className);
            case this.RUTUBE:
                return this.getRuTubeDetails(url);
            case this.VK:
                return this.getVKDetails(url);
            default:
                return null;
        }
    }
    static getVKDetails(url) {
        const match = url.match(/video(-?\d+)_(\d+)/);
        const startMatch = url.match(/start=(\d+)/);
        if (match) {
            const videoId = `${match[1]}_${match[2]}`;
            const startTime = startMatch ? startMatch[1] : null;
            return {
                id: videoId,
                thumbnail: `images/video/video${videoId}_cover.jpg`,
                videoUrl: `https://vk.com/video${videoId}`,
                startTime: startTime,
                service: this.VK,
            };
        }
        return null;
    }
    static getRuTubeDetails(url) {
        const match = url.match(/video\/([a-zA-Z0-9]+)/);
        const timeMatch = url.match(/t=(\d+)/);
        if (match) {
            const videoId = match[1];
            const startTime = timeMatch ? timeMatch[1] : null;
            return {
                id: videoId,
                thumbnail: `https://preview.rutube.ru/preview/${videoId}.webp`,
                videoUrl: `https://rutube.ru/video/${videoId}`,
                startTime: startTime,
                service: this.RUTUBE,
            };
        }
        return null;
    }
    static getYouTubeDetails(url, className) {
        const urlObj = new URL(url);
        const videoId = urlObj.hostname === 'youtu.be'
            ? urlObj.pathname.slice(1)
            : urlObj.searchParams.get('v');
        const timeMatch = urlObj.searchParams.get('t');
        const startTime = timeMatch || null;
        const thumbnailType = className && className.includes('Ytube-mini') ? 'mqdefault' : 'maxresdefault';
        return videoId ? {
            id: videoId,
            thumbnail: `https://img.youtube.com/vi/${videoId}/${thumbnailType}.jpg`,
            videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
            startTime: startTime,
            service: this.YOUTUBE,
        } : null;
    }
}
class PopupOverlay {
    constructor() {
        this.container = null;
    }
    setContent(content) {
        if (!this.container) {
            this.createOverlay();
        }
        const frame = this.container.querySelector('.iPopFrame');
        frame.innerHTML = '';
        const loader = document.createElement('div');
        loader.className = 'iPopLoader';
        frame.appendChild(loader);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content.trim();
        const img = tempDiv.querySelector('img');
        const iframe = tempDiv.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', () => {
                loader.remove();
            });
            frame.appendChild(iframe);
        } else if (img) {
            img.addEventListener('load', () => {
                loader.remove();
            });
            img.addEventListener('error', () => {
                loader.remove();
                console.error('Ошибка загрузки изображения');
            });
            while (tempDiv.firstChild) {
                frame.appendChild(tempDiv.firstChild);
            }
        } else {
            while (tempDiv.firstChild) {
                frame.appendChild(tempDiv.firstChild);
            }
            loader.remove();
        }
    }
    createOverlay() {
        const overlayHtml = `
            <div class="iPopOverlay">
                <button type="button" class="closeIpop" title="Close"></button>
                <div class="iPopFrame"></div>
            </div>`;
        const fragment = document.createRange().createContextualFragment(overlayHtml);
        document.body.appendChild(fragment);
        this.container = document.querySelector('.iPopOverlay');
        this.addEventListeners();
    }
    addEventListeners() {
        this.container.querySelector('.closeIpop').addEventListener('click', () => this.close());
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
    }
    open() {
        if (!this.container) {
            this.createOverlay();
        }
    }
    close() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}
class ImageGallery {
    constructor(overlay) {
        this.overlay = overlay;
        this.images = [];
        this.currentIndex = 0;
    }
    handle(target) {
        let group = target.dataset.iPopGroup;
        if (!group) {
            group = target.getAttribute('data-iPop-group');
        }
        if (group) {
            this.loadGroup(group, target);
        } else {
            this.showSingleImage(target);
        }
    }
    loadGroup(group, target) {
        this.images = Array.from(document.querySelectorAll(`[data-iPop-group="${group}"]`)).map(el => ({
            src: el.href,
            title: el.querySelector('img')?.title || ''
        }));
        this.currentIndex = this.images.findIndex(img => img.src === target.href);
        this.showImage(this.currentIndex);
    }
    showSingleImage(target) {
        const img = target.querySelector('img');
        const imgUrl = target.href;
        const imgTitle = img ? img.title || '' : '';
        const content = `
            <img src="${imgUrl}" alt="">
            ${imgTitle ? `<div class="iPopImgTitle">${imgTitle}</div>` : ''}`;
        this.overlay.setContent(content);
        this.overlay.open();
    }
    addSwipeHandlers() {
        let touchStartX = 0;
        let touchEndX = 0;
        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };
        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        };
        const container = this.overlay.container;
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchend', handleTouchEnd);
        this.handleSwipe = () => {
            const diff = touchStartX - touchEndX;
            if (diff > 50) {
                this.nextImage();
            } else if (diff < -50) {
                this.prevImage();
            }
        };
    }
    showImage(index) {
        const image = this.images[index];
        const total = this.images.length;
        const currentNumber = index + 1;
        const content = `
        <img src="${image.src}" alt="">
        ${image.title ? `<div class="iPopImgTitle">${image.title}</div>` : ''}
        <div class="iPopImgCounter">${currentNumber} / ${total}</div>
        <div class="iPopNextImg" title="Next"></div>
        <div class="iPopPrevImg" title="Prev"></div>`;
        this.overlay.setContent(content);
        this.overlay.open();
        this.addNavigationHandlers();
        this.addSwipeHandlers();
    }    addNavigationHandlers() {
        const nextButton = this.overlay.container.querySelector('.iPopNextImg');
        const prevButton = this.overlay.container.querySelector('.iPopPrevImg');
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextImage());
        }
        if (prevButton) {
            prevButton.addEventListener('click', () => this.prevImage());
        }
    }
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.showImage(this.currentIndex);
    }
    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.showImage(this.currentIndex);
    }
}
class VideoHandler {
    constructor(popupOverlay) {
        this.popupOverlay = popupOverlay;
    }
    init() {
        const videoLinks = document.querySelectorAll('.iPop-video');
        videoLinks.forEach((link) => {
            const videoUrl = link.href;
            const className = link.className;
            const details = VideoService.getServiceDetails(videoUrl, className);
            if (details) {
                if (!link.innerHTML.trim()) {
                    link.innerHTML = this.generatePreview(details);
                }
            } else {
                console.error("Не удалось определить сервис для ссылки:", videoUrl);
            }
        });
        document.addEventListener('click', (event) => {
            const target = event.target;
            const videoTarget = target.closest('.iPop-video');
            if (videoTarget) {
                event.preventDefault();
                this.handle(videoTarget.href);
            }
        });
    }
    handle(url) {
        const details = VideoService.getServiceDetails(url);
        const iframeHtml = this.generateIframe(details);
        this.popupOverlay.setContent(iframeHtml);
        this.popupOverlay.open();
    }
    generatePreview(details) {
        if (!details) {
            return `<img src="images/video/no-video.jpg" alt="Нет превью">`;
        }
        if (details.service === VideoService.VK) {
            const thumbnailPath = details.thumbnail;
            return `<img src="${thumbnailPath}" alt="VK превью" onerror="this.src='images/video/no-video.jpg'">`;
        }
        if (details.thumbnail) {
            return `<img src="${details.thumbnail}" alt="Видео превью">`;
        }
        return `<img src="images/video/no-video.jpg" alt="Нет превью">`;
    }
    generateIframe(details) {
        let iframeSrc = '';
        switch (details.service) {
            case VideoService.YOUTUBE:
                iframeSrc = `https://www.youtube.com/embed/${details.id}?wmode=transparent&rel=0&autoplay=1${details.startTime ? `&start=${details.startTime}` : ''}`;
                break;
            case VideoService.RUTUBE:
                iframeSrc = `https://rutube.ru/play/embed/${details.id}?autoplay=1${details.startTime ? `&t=${details.startTime}` : ''}`;
                break;
            case VideoService.VK:
                const [oid, id] = details.id.split('_');
                iframeSrc = `https://vk.com/video_ext.php?oid=${oid}&id=${id}&autoplay=1${details.startTime ? `&t=${details.startTime}` : ''}`;
                break;
            default:
                console.error("Неизвестный сервис:", details.service);
                return '';
        }
        return `<iframe src="${iframeSrc}" frameborder="0" allow="autoplay; encrypted-media; fullscreen;"></iframe>`;
    }
}
class FrameHandler {
    constructor(overlayInstance) {
        this.overlay = overlayInstance;
    }
    handle(url) {
        const frameElement = `<iframe src="${url}" frameborder="0"></iframe>`;
        this.overlay.setContent(frameElement);
        this.overlay.open();
    }
}
class PopupHandler {
    constructor(overlayInstance) {
        this.overlay = overlayInstance;
    }
    handle(id) {
        const contentDiv = document.getElementById(id);
        if (contentDiv) {
            this.overlay.setContent(contentDiv.outerHTML);
            this.overlay.open();
        } else {
            this.overlay.setContent('<p>Upp-s</p>');
            this.overlay.open();
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = new PopupOverlay();
    const imageGallery = new ImageGallery(popupOverlay);
    const videoHandler = new VideoHandler(popupOverlay);
    videoHandler.init();
    const frameHandler = new FrameHandler(popupOverlay);
    const popupHandler = new PopupHandler(popupOverlay);
    document.addEventListener('click', (event) => {
        const target = event.target;
        const imageTarget = target.closest('.iPop-img');
        if (imageTarget) {
            event.preventDefault();
            imageGallery.handle(imageTarget);
            return;
        }
        const videoTarget = target.closest('.iPop-video');
        if (videoTarget) {
            event.preventDefault();
            videoHandler.handle(videoTarget.href);
            return;
        }
        if (target.closest('.iPop-up')) {
            event.preventDefault();
            const href = target.closest('.iPop-up').getAttribute('href').substring(1);
            popupHandler.handle(href);
        }
        if (target.closest('.iPop-iframe')) {
            event.preventDefault();
            const iframeUrl = target.closest('.iPop-iframe').href;
            frameHandler.handle(iframeUrl);
        }
    });
});
