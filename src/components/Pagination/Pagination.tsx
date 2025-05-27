import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  siblingCount = 1
}: PaginationProps) {
  
  // Tạo mảng số trang để hiển thị
  const getPageNumbers = () => {
    // Trường hợp tổng số trang ít
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    // Không hiện ellipsis
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;
    
    if (!showLeftDots && showRightDots) {
      // Hiện ellipsis bên phải
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }
    
    if (showLeftDots && !showRightDots) {
      // Hiện ellipsis bên trái
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount }, 
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, '...', ...rightRange];
    }
    
    if (showLeftDots && showRightDots) {
      // Hiện ellipsis cả hai bên
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, '...', ...middleRange, '...', totalPages];
    }
    
    // Không có trường hợp này nhưng để tránh lỗi
    return [];
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <nav className="flex items-center space-x-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`min-w-[85px] px-3 py-1.5 text-sm rounded-md border flex items-center justify-center gap-1 ${
          currentPage === 1
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'hover:bg-gray-50 active:bg-gray-100 transition-colors'
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Trước</span>
      </button>
      
      {/* Centered page numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-1.5">...</span>
            ) : (
              <button
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`min-w-[40px] px-3 py-1.5 text-sm rounded-md border ${
                  currentPage === page
                    ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                    : 'hover:bg-gray-50 active:bg-gray-100 transition-colors'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`min-w-[85px] px-3 py-1.5 text-sm rounded-md border flex items-center justify-center gap-1 ${
          currentPage === totalPages
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'hover:bg-gray-50 active:bg-gray-100 transition-colors'
        }`}
      >
        <span>Tiếp</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}