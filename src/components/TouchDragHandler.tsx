'use client';

import { useRef, useCallback } from 'react';

interface TouchDragHandlerProps {
  onReorder: (fromIndex: number, toIndex: number) => void;
  children: React.ReactNode;
  itemCount: number;
}

export default function TouchDragHandler({ onReorder, children, itemCount }: TouchDragHandlerProps) {
  const draggedElement = useRef<HTMLElement | null>(null);
  const draggedIndex = useRef<number>(-1);
  const touchStartY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const target = e.target as HTMLElement;
    const taskCard = target.closest('[data-task-index]') as HTMLElement;
    
    if (!taskCard) return;

    const index = parseInt(taskCard.getAttribute('data-task-index') || '-1');
    if (index === -1) return;

    // Предотвращаем выделение текста
    e.preventDefault();
    
    draggedElement.current = taskCard;
    draggedIndex.current = index;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;

    // Добавляем визуальные эффекты после небольшой задержки
    setTimeout(() => {
      if (draggedElement.current) {
        draggedElement.current.style.transform = 'scale(1.05) rotate(2deg)';
        draggedElement.current.style.zIndex = '1000';
        draggedElement.current.style.opacity = '0.9';
        isDragging.current = true;
      }
    }, 150);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!draggedElement.current || !isDragging.current) return;

    e.preventDefault();
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartY.current;
    
    // Перемещаем элемент
    draggedElement.current.style.transform = `translateY(${deltaY}px) scale(1.05) rotate(2deg)`;

    // Находим элемент под пальцем
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetCard = elementBelow?.closest('[data-task-index]') as HTMLElement;
    
    if (targetCard && targetCard !== draggedElement.current) {
      const targetIndex = parseInt(targetCard.getAttribute('data-task-index') || '-1');
      
      if (targetIndex !== -1 && targetIndex !== draggedIndex.current) {
        // Визуальная обратная связь
        const allCards = document.querySelectorAll('[data-task-index]');
        allCards.forEach(card => {
          (card as HTMLElement).style.transform = '';
        });
        
        if (targetIndex > draggedIndex.current) {
          targetCard.style.transform = 'translateY(-10px)';
        } else {
          targetCard.style.transform = 'translateY(10px)';
        }
      }
    }
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!draggedElement.current) return;

    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetCard = elementBelow?.closest('[data-task-index]') as HTMLElement;
    
    if (targetCard && targetCard !== draggedElement.current && isDragging.current) {
      const targetIndex = parseInt(targetCard.getAttribute('data-task-index') || '-1');
      
      if (targetIndex !== -1 && targetIndex !== draggedIndex.current) {
        onReorder(draggedIndex.current, targetIndex);
      }
    }

    // Сброс стилей
    const allCards = document.querySelectorAll('[data-task-index]');
    allCards.forEach(card => {
      const cardElement = card as HTMLElement;
      cardElement.style.transform = '';
      cardElement.style.zIndex = '';
      cardElement.style.opacity = '';
    });

    draggedElement.current = null;
    draggedIndex.current = -1;
    isDragging.current = false;
  }, [onReorder]);

  const handleTouchCancel = useCallback(() => {
    if (draggedElement.current) {
      draggedElement.current.style.transform = '';
      draggedElement.current.style.zIndex = '';
      draggedElement.current.style.opacity = '';
    }

    const allCards = document.querySelectorAll('[data-task-index]');
    allCards.forEach(card => {
      const cardElement = card as HTMLElement;
      cardElement.style.transform = '';
    });

    draggedElement.current = null;
    draggedIndex.current = -1;
    isDragging.current = false;
  }, []);

  // Добавляем обработчики событий
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.addEventListener('touchstart', handleTouchStart, { passive: false });
      node.addEventListener('touchmove', handleTouchMove, { passive: false });
      node.addEventListener('touchend', handleTouchEnd);
      node.addEventListener('touchcancel', handleTouchCancel);
      
      return () => {
        node.removeEventListener('touchstart', handleTouchStart);
        node.removeEventListener('touchmove', handleTouchMove);
        node.removeEventListener('touchend', handleTouchEnd);
        node.removeEventListener('touchcancel', handleTouchCancel);
      };
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel]);

  return (
    <div ref={containerRef} className="select-none">
      {children}
    </div>
  );
}

