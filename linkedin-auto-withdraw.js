// ==UserScript==
// @name         LinkedIn Auto Withdraw Sent Connections
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automatically withdraws all sent connection requests on the LinkedIn sent connections page
// @author       Shagbaor Agber
// @match        https://www.linkedin.com/mynetwork/invitation-manager/sent/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function clickButton(button) {
        if (button && button.click) {
            button.click();
            console.log('Clicked button:', button.textContent.trim());
            return true;
        }
        return false;
    }

    function withdrawSentConnections() {
        console.log('Searching for withdraw buttons...');
        const withdrawButtons = Array.from(document.querySelectorAll('button'))
        .filter(button => button.textContent.trim() === 'Withdraw');

        console.log(`Found ${withdrawButtons.length} withdraw buttons`);

        withdrawButtons.forEach((button, index) => {
            setTimeout(() => {
                console.log(`Attempting to withdraw invitation ${index + 1}`);
                if (clickButton(button)) {
                    setTimeout(() => {
                        console.log('Searching for confirm button...');
                        const confirmButton = Array.from(document.querySelectorAll('button'))
                        .find(btn => btn.textContent.trim() === 'Withdraw' &&
                              btn.closest('.artdeco-modal__confirm-dialog-btn'));

                        if (clickButton(confirmButton)) {
                            console.log('Confirmation successful');
                        } else {
                            console.log('Failed to find or click confirm button');
                        }
                    }, 1000);
                } else {
                    console.log('Failed to click withdraw button');
                }
            }, index * 5000);
        });
    }

    function addWithdrawAllButton() {
        const container = document.querySelector('.mn-invitation-manager__header');
        if (container) {
            const button = document.createElement('button');
            button.textContent = 'Withdraw All';
            button.className = 'artdeco-button artdeco-button--muted artdeco-button--2 artdeco-button--secondary ember-view';
            button.addEventListener('click', withdrawSentConnections);
            container.appendChild(button);
            console.log('Added "Withdraw All" button');
        } else {
            console.log('Could not find container for "Withdraw All" button');
        }
    }

    // Run the script when the page is fully loaded
    window.addEventListener('load', () => {
        console.log('Page loaded, adding Withdraw All button');
        addWithdrawAllButton();
    });
})();
