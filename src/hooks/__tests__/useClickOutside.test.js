import { renderHook } from '@testing-library/react';
import useClickOutside from '../useClickOutside';

describe('useClickOutside', () => {
    it('should call handler when clicking outside of the element', () => {
        const handler = jest.fn();
        const ref = {
            current: document.createElement('div')
        };
        document.body.appendChild(ref.current);

        renderHook(() => useClickOutside(ref, handler));

        // Click inside
        ref.current.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(handler).not.toHaveBeenCalled();

        // Click outside
        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(handler).toHaveBeenCalledTimes(1);

        document.body.removeChild(ref.current);
    });

    it('should not call handler if ref is null', () => {
        const handler = jest.fn();
        const ref = { current: null };

        renderHook(() => useClickOutside(ref, handler));

        document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        expect(handler).not.toHaveBeenCalled();
    });
});
