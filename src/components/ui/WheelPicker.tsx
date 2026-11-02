import { useRef, useEffect, useCallback } from 'react';

interface WheelPickerProps {
  items: { value: string | number; label: string }[];
  value: string | number;
  onChange: (value: string | number) => void;
  itemHeight?: number;
  visibleItems?: number;
  width?: string;
  ariaLabel?: string;
}

export function WheelPicker({
  items,
  value,
  onChange,
  itemHeight = 40,
  visibleItems = 5,
  width = 'flex-1',
  ariaLabel
}: WheelPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const scrollTimeoutRef = useRef<number>();

  const selectedIndex = items.findIndex(item => item.value === value);
  const centerOffset = Math.floor(visibleItems / 2);
  const containerHeight = itemHeight * visibleItems;
  const padding = itemHeight * centerOffset;

  // اسکرول به آیتم انتخاب‌شده
  const scrollToIndex = useCallback((index: number, smooth = false) => {
    if (!containerRef.current) return;
    isProgrammaticScroll.current = true;
    containerRef.current.scrollTo({
      top: index * itemHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
    // بعد از اسکرول، قفل را آزاد کن
    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, smooth ? 350 : 50);
  }, [itemHeight]);

  // در بارگذاری اولیه و تغییر مقدار از بیرون
  useEffect(() => {
    if (selectedIndex >= 0) {
      scrollToIndex(selectedIndex, false);
    }
  }, [selectedIndex, scrollToIndex]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    if (isProgrammaticScroll.current) return;

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const newIndex = Math.round(scrollTop / itemHeight);
      const clampedIndex = Math.max(0, Math.min(items.length - 1, newIndex));

      // Snap به موقعیت دقیق
      scrollToIndex(clampedIndex, true);

      const newValue = items[clampedIndex].value;
      if (newValue !== value) {
        onChange(newValue);
      }
    }, 120);
  };

  const handleItemClick = (index: number) => {
    scrollToIndex(index, true);
    onChange(items[index].value);
  };

  return (
    <div
      className={'relative ' + width}
      style={{ height: containerHeight }}
      role="listbox"
      aria-label={ariaLabel}
    >
      {/* نوارهای محو بالا و پایین */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: padding,
          background: 'linear-gradient(to bottom, var(--luma-bg-subtle) 0%, transparent 100%)'
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: padding,
          background: 'linear-gradient(to top, var(--luma-bg-subtle) 0%, transparent 100%)'
        }}
      />

      {/* خط انتخاب مرکزی */}
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none border-y border-[var(--luma-gold)]/40"
        style={{
          top: padding,
          height: itemHeight
        }}
      />

      {/* لیست اسکرول‌شو */}
      <div
        ref={containerRef}
        className="overflow-y-auto no-scrollbar h-full"
        onScroll={handleScroll}
        style={{
          scrollBehavior: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div style={{ height: padding }} aria-hidden="true" />
        {items.map((item, index) => {
          const isSelected = item.value === value;
          return (
            <button
              key={item.value}
              onClick={() => handleItemClick(index)}
              className={[
                'w-full flex items-center justify-center transition-all duration-200',
                isSelected
                  ? 'text-[var(--luma-gold)] font-bold text-lg'
                  : 'text-[var(--luma-text-muted)] text-base opacity-60'
              ].join(' ')}
              style={{ height: itemHeight }}
              role="option"
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
            >
              {item.label}
            </button>
          );
        })}
        <div style={{ height: padding }} aria-hidden="true" />
      </div>
    </div>
  );
}