import { trigger, state, style, transition, animate, keyframes } from '@angular/core';

export const newApply = trigger('newApply', [
    state('out', style({
        opacity: '0',
        display: "none"
    })),
    state('in', style({
        opacity: '0.94'
    })),
    transition('out => in', animate('200ms ease-in')),
    transition('in => out', animate('200ms ease-out'))
]);
export const indiaType = trigger('indiaType', [
    state('out', style({
        opacity: '0',
    })),
    state('in', style({
        opacity: '1'
    })),
    transition('out => in', animate('200ms ease-in')),
    transition('in => out', animate('200ms ease-out'))
])