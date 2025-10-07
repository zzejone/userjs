// ==UserScript==
// @name         DeepSeek 对话目录生成器
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为DeepSeek对话添加可折叠目录
// @author       jone
// @match        https://chat.deepseek.com/*
// @match        https://www.chat.deepseek.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let currentConversationId = '';
    let isDirectoryVisible = true;
    let directoryContainer = null;
    let observer = null;

    // 创建目录容器
    function createDirectoryContainer() {
        if (directoryContainer) {
            directoryContainer.remove();
        }

        directoryContainer = document.createElement('div');
        directoryContainer.id = 'deepseek-directory';
        directoryContainer.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 280px;
            max-height: 60vh;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-family: system-ui, -apple-system, sans-serif;
            overflow: hidden;
        `;

        // 标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            background: #f8fafc;
            border-bottom: 1px solid #e5e7eb;
            cursor: move;
            user-select: none;
        `;

        const title = document.createElement('span');
        title.textContent = '对话目录';
        title.style.cssText = 'font-weight: 600; color: #374151; font-size: 14px;';

        const controls = document.createElement('div');
        controls.style.cssText = 'display: flex; gap: 8px;';

        // 刷新按钮
        const refreshBtn = createControlButton('🔄', '刷新目录', refreshDirectory);
        // 折叠按钮
        const toggleBtn = createControlButton('−', '折叠目录', toggleDirectory);

        controls.appendChild(refreshBtn);
        controls.appendChild(toggleBtn);
        header.appendChild(title);
        header.appendChild(controls);

        // 内容区域
        const content = document.createElement('div');
        content.id = 'directory-content';
        content.style.cssText = `
            padding: 0;
            max-height: 400px;
            overflow-y: auto;
            background: white;
        `;

        directoryContainer.appendChild(header);
        directoryContainer.appendChild(content);
        document.body.appendChild(directoryContainer);

        makeElementDraggable(directoryContainer, header);
    }

    // 创建控制按钮
    function createControlButton(icon, title, onClick) {
        const button = document.createElement('button');
        button.innerHTML = icon;
        button.title = title;
        button.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            font-size: 12px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        `;
        button.addEventListener('mouseover', () => button.style.background = '#e5e7eb');
        button.addEventListener('mouseout', () => button.style.background = 'none');
        button.addEventListener('click', onClick);

        return button;
    }

    // 拖拽功能
    function makeElementDraggable(element, handle) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        handle.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        }

        function drag(e) {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newX = initialX + dx;
            let newY = initialY + dy;

            // 限制在视窗内
            newX = Math.max(0, Math.min(newX, window.innerWidth - element.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - 100));

            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
            element.style.right = 'auto';
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }

    // 刷新目录
    function refreshDirectory() {
        generateDirectory();
    }

    // 切换目录显示
    function toggleDirectory() {
        const content = document.getElementById('directory-content');
        const toggleBtn = directoryContainer.querySelector('button[title="折叠目录"]');

        if (isDirectoryVisible) {
            content.style.display = 'none';
            toggleBtn.innerHTML = '+';
            toggleBtn.title = '展开目录';
            isDirectoryVisible = false;
        } else {
            content.style.display = 'block';
            toggleBtn.innerHTML = '−';
            toggleBtn.title = '折叠目录';
            isDirectoryVisible = true;
        }
    }

    // 生成目录内容
    function generateDirectory() {
        const content = document.getElementById('directory-content');
        if (!content) return;

        // 使用更精确的选择器获取用户消息
        const userMessages = Array.from(document.querySelectorAll('[data-testid*="message"], [class*="message"]'))
            .filter(msg => {
                const text = msg.textContent || '';
                return text.trim().length > 10 &&
                       !msg.querySelector('img, video') && // 排除媒体内容
                       msg.offsetHeight > 0; // 确保元素可见
            });

        if (userMessages.length === 0) {
            content.innerHTML = '<div style="padding: 20px; text-align: center; color: #6b7280; font-size: 13px;">暂无对话内容</div>';
            return;
        }

        const directoryItems = [];
        let questionCount = 0;

        userMessages.forEach((message, index) => {
            // 只记录用户的提问
            if(index % 2 != 0){
                return
            }

            const textContent = (message.textContent || '').trim();
            if (textContent && textContent.length > 5) {
                questionCount++;
                const title = textContent.substring(0, 40) + (textContent.length > 40 ? '...' : '');

                const item = document.createElement('div');
                item.className = 'directory-item';
                item.style.cssText = `
                    padding: 10px 12px;
                    border-bottom: 1px solid #f3f4f6;
                    cursor: pointer;
                    transition: background 0.2s;
                    font-size: 13px;
                    line-height: 1.4;
                `;
                item.addEventListener('mouseover', () => item.style.background = '#f9fafb');
                item.addEventListener('mouseout', () => item.style.background = 'white');
                item.addEventListener('click', () => scrollToMessage(message));

                item.innerHTML = `
                    <div style="display: flex; align-items: flex-start; gap: 8px;">
                        <span style="
                            background: #3b82f6;
                            color: white;
                            border-radius: 50%;
                            width: 18px;
                            height: 18px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 11px;
                            flex-shrink: 0;
                            margin-top: 1px;
                        ">${questionCount}</span>
                        <span style="color: #374151;">${escapeHtml(title)}</span>
                    </div>
                `;

                directoryItems.push(item);
            }
        });

        content.innerHTML = '';
        directoryItems.forEach(item => content.appendChild(item));

        if (directoryItems.length === 0) {
            content.innerHTML = '<div style="padding: 20px; text-align: center; color: #6b7280; font-size: 13px;">未找到有效问题</div>';
        }
    }

    // 滚动到消息
    function scrollToMessage(messageElement) {
        messageElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // 高亮效果
        const originalBackground = messageElement.style.background;
        messageElement.style.background = '#fef3cd';
        messageElement.style.transition = 'background 0.3s';

        setTimeout(() => {
            messageElement.style.background = originalBackground;
        }, 1500);
    }

    // HTML转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 检测URL变化
    function setupUrlChangeDetection() {
        let lastUrl = location.href;

        const checkUrlChange = () => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                // 延迟执行确保页面加载完成
                setTimeout(refreshDirectory, 800);
            }
        };

        setInterval(checkUrlChange, 500);
    }

    // 优化版的DOM变化监听
    function setupOptimizedObserver() {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // 元素节点
                            const element = node;
                            if (element.querySelector &&
                                (element.querySelector('[data-testid*="message"]') ||
                                 element.textContent && element.textContent.length > 20)) {
                                shouldUpdate = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldUpdate) break;
            }

            if (shouldUpdate) {
                // 防抖处理
                clearTimeout(window.directoryUpdateTimeout);
                window.directoryUpdateTimeout = setTimeout(refreshDirectory, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // 初始化
    function init() {
        // 等待页面加载完成
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        createDirectoryContainer();
        setupUrlChangeDetection();
        setupOptimizedObserver();

        // 初始生成目录
        setTimeout(refreshDirectory, 1500);

        console.log('DeepSeek 目录脚本已加载');
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 清理函数
    window.addEventListener('beforeunload', () => {
        if (observer) {
            observer.disconnect();
        }
        if (directoryContainer) {
            directoryContainer.remove();
        }
    });

})();
