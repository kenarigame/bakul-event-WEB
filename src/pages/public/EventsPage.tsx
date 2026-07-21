import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EventCard } from "@/components/events/EventCard";
import { EventGridSkeleton } from "@/components/events/EventCardSkeleton";
import { SearchBar } from "@/components/events/SearchBar";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { eventsApi } from "@/services/api.service";

export function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const city = searchParams.get("city") || "";
  const sortBy = searchParams.get("sortBy") || "startDate";
  const sortOrder = searchParams.get("sortOrder") || "asc";
  const isFree = searchParams.get("isFree") || "";

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: () => eventsApi.getCategories(),
  });

  const { data: eventsRes, isLoading } = useQuery({
    queryKey: [
      "events",
      { search, categoryId, city, sortBy, sortOrder, isFree, page },
    ],
    queryFn: () =>
      eventsApi.getAll({
        search: search || undefined,
        categoryId: categoryId || undefined,
        city: city || undefined,
        sortBy,
        sortOrder,
        isFree: isFree || undefined,
        page,
        limit: 12,
      }),
  });

  const events = eventsRes?.data?.data || [];
  const meta = eventsRes?.data?.meta;
  const categories = categoriesRes?.data?.data || [];

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPage(1);
  };

  const activeFiltersCount = [categoryId, city, isFree].filter(Boolean).length;

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-semibold mb-2 block">Category</Label>
        <Select
          value={categoryId}
          onValueChange={(v) => updateParam("categoryId", v === "all" ? "" : (v ?? ""))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-semibold mb-2 block">City</Label>
        <Input
          placeholder="Filter by city..."
          value={city}
          onChange={(e) => updateParam("city", e.target.value)}
        />
      </div>

      <div>
        <Label className="text-sm font-semibold mb-2 block">Price</Label>
        <Select
          value={isFree}
          onValueChange={(v) => updateParam("isFree", v === "all" ? "" : (v ?? ""))}
        >
          <SelectTrigger>
            <SelectValue placeholder="All prices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Free</SelectItem>
            <SelectItem value="false">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />
      <Button variant="outline" className="w-full" onClick={clearFilters}>
        <X className="mr-2 size-4" />
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Discover Events
        </h1>
        <p className="text-muted-foreground">
          Find your next unforgettable experience
        </p>
      </div>

      {/* Search & Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar
            value={search}
            onSearch={(v) => updateParam("search", v)}
            placeholder="Search events..."
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(v) => {
              const [by, order] = (v ?? "").split("-");
              updateParam("sortBy", by);
              updateParam("sortOrder", order);
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startDate-asc">Date: Earliest</SelectItem>
              <SelectItem value="startDate-desc">Date: Latest</SelectItem>
              <SelectItem value="name-asc">Name: A-Z</SelectItem>
              <SelectItem value="createdAt-desc">Newest</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile filter */}
          <Sheet>
            <SheetTrigger >
              <Button variant="outline" className="sm:hidden relative">
                <SlidersHorizontal className="size-4" />
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 size-4 p-0 text-[10px] flex items-center justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters sidebar */}
        <aside className="hidden sm:block w-56 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </h3>
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Events grid */}
        <div className="flex-1 min-w-0">
          {search && (
            <p className="text-sm text-muted-foreground mb-4">
              {meta?.total || 0} results for "
              <span className="font-medium text-foreground">{search}</span>"
            </p>
          )}

          {isLoading ? (
            <EventGridSkeleton count={12} />
          ) : events.length === 0 ? (
            <EmptyState
              title="No events found"
              description="Try adjusting your search or filters to find events."
              action={{ label: "Clear Filters", onClick: clearFilters }}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>

              {meta && meta.totalPages > 1 && (
                <div className="mt-10">
                  <Pagination
                    page={page}
                    totalPages={meta.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
