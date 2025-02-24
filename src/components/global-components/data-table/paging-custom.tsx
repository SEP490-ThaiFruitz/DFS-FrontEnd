import { useState } from 'react';
import {
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationContent,
  Pagination,
} from '@/components/ui/pagination'; // Adjust import path based on your setup
interface PaginationCustomComponentProps {
  totalItems: number;
  itemsPerPage: number;
  onChangePageIndex: (pageNumber: number) => void;
}

const PaginationCustom = ({ totalItems, itemsPerPage, onChangePageIndex }: PaginationCustomComponentProps) => {
  // State to track the current page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the range of items shown on the current page
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onChangePageIndex(page);
    }
  };

  // Generate pagination links dynamically (simplified for this example)
  const renderPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 5; // Limit visible page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    links.push(
      <PaginationItem key="prev">
        <PaginationPrevious onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} />
      </PaginationItem>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => goToPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis if there are more pages
    if (endPage < totalPages) {
      links.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
      // Show last page
      links.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => goToPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    links.push(
      <PaginationItem key="next">
        <PaginationNext onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} />
      </PaginationItem>
    );

    return links;
  };

  return (
    <div className="my-5 flex items-center justify-between gap-8">
      <p>
        Hiển thị {startItem} đến {endItem} trong số {totalItems}
      </p>
      <div>
        <Pagination>
          <PaginationContent>
            {renderPaginationLinks()}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationCustom;