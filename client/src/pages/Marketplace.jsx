import { useState } from "react";
import { useSelector } from "react-redux";
import { ArrowLeftIcon, FilterIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import FilterSidebar from "../components/FilterSidebar";
import ListingCard from "../components/ListingCard";

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const { listings = [] } = useSelector((state) => state.listing || {});

  const [filters, setFilters] = useState({
    platform: null,
    maxPrice: 100000,
    minFollowers: 0,
    niche: null,
    verified: false,
    monetized: false,
  });

  const [showFilterPhone, setShowFilterPhone] = useState(false);

  const filteredListings = (listings || []).filter((listing) => {
    if (!listing) return false;

    // Platform Filter
    if (filters.platform?.length > 0) {
      if (!filters.platform.includes(listing.platform)) return false;
    }

    // Price Filter
    if (filters.maxPrice && (listing.price || 0) > filters.maxPrice) {
      return false;
    }

    // Followers Filter
    if (
      filters.minFollowers &&
      (listing.followers_count || 0) < filters.minFollowers
    ) {
      return false;
    }

    // Niche Filter
    if (filters.niche?.length > 0) {
      if (!filters.niche.includes(listing.niche)) return false;
    }

    // Verified Filter
    if (filters.verified && listing.verified !== filters.verified) {
      return false;
    }

    // Monetized Filter
    if (filters.monetized && listing.monetized !== filters.monetized) {
      return false;
    }

    // Search Filter
    if (search) {
      const trimmed = search.trim().toLowerCase();

      if (
        !(listing.title || "").toLowerCase().includes(trimmed) &&
        !(listing.username || "").toLowerCase().includes(trimmed) &&
        !(listing.description || "").toLowerCase().includes(trimmed) &&
        !(listing.platform || "").toLowerCase().includes(trimmed) &&
        !(listing.niche || "").toLowerCase().includes(trimmed)
      ) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-slate-500">
        <button
          onClick={() => {
            navigate("/");
            window.scrollTo(0, 0);
          }}
          className="flex items-center gap-2 py-5"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Home
        </button>

        <button
          onClick={() => setShowFilterPhone(true)}
          className="flex sm:hidden items-center gap-2 py-5"
        >
          <FilterIcon className="size-4" />
          Filters
        </button>
      </div>

      {/* Marketplace */}
      <div className="relative flex items-start justify-between gap-8 pb-8">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          showFilterPhone={showFilterPhone}
          setShowFilterPhone={setShowFilterPhone}
        />

        <div className="flex-1 grid xl:grid-cols-2 gap-4">
          {filteredListings.length > 0 ? (
            filteredListings
              .sort((a, b) => (a.featured ? -1 : b.featured ? 1 : 0))
              .map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                />
              ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No listings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;