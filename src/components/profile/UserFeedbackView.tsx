import React, { useEffect, useMemo, useRef, useState } from "react";
import "./UserFeedbackView.scss";
import InteractiveFeedbackCard from "@src/components/InteractiveFeedbackCard/InteractiveFeedbackCard";
import { useFetchUserFeedback } from "@src/hooks/useFetchUserFeedback";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import SqueletonAnime from "../loader/SqueletonAnime";
import Champs, { type SelectFilterOption } from "../champs/Champs";

interface Props {
  activeTab: FeedbackType;
}

const normalizeBrand = (value?: string) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const UserFeedbackView: React.FC<Props> = ({ activeTab }) => {
  const { data, loading } = useFetchUserFeedback(activeTab);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedBrand("");
    setOpenId(null);
  }, [activeTab]);

  const brandOptions = useMemo<SelectFilterOption[]>(() => {
    const placeholder: SelectFilterOption = {
      value: "",
      label: "Choisir une marque",
    };

    if (!data.length) return [placeholder];

    const uniq = new Map<string, SelectFilterOption>();
    data.forEach((item) => {
      const brandLabel = item.marque?.trim();
      if (!brandLabel) return;

      const key = normalizeBrand(brandLabel);
      if (uniq.has(key)) return;

      uniq.set(key, {
        value: brandLabel,
        label: brandLabel,
        iconAlt: brandLabel,
        iconFallback: brandLabel,
        siteUrl: (item as any).siteUrl || (item as any).brandUrl,
      });
    });

    const sorted = Array.from(uniq.values()).sort((a, b) =>
      a.label.localeCompare(b.label, "fr", { sensitivity: "base" }),
    );

    return [placeholder, ...sorted];
  }, [data]);

  useEffect(() => {
    if (!selectedBrand) return;
    const exists = brandOptions.some((opt) => opt.value === selectedBrand);
    if (!exists) setSelectedBrand("");
  }, [brandOptions, selectedBrand]);

  const filteredData = useMemo(() => {
    if (!selectedBrand) return data;
    const target = normalizeBrand(selectedBrand);
    return data.filter((item) => normalizeBrand(item.marque) === target);
  }, [data, selectedBrand]);

  useEffect(() => {
    setOpenId(null);
  }, [selectedBrand]);

  const renderContent = () => {
    if (loading) {
      return (
        <SqueletonAnime
          loaderRef={loaderRef}
          loading={true}
          hasMore={false}
          error={null}
        />
      );
    }

    if (!filteredData.length) {
      return (
        <div className="user-feedback-empty">
          {selectedBrand
            ? "Aucun contenu pour cette marque."
            : "Aucun contenu trouvé."}
        </div>
      );
    }

    if (activeTab === "coupdecoeur") {
      return (
        <>
          {(filteredData as CoupDeCoeur[]).map((item, index) => (
            <InteractiveFeedbackCard
              key={item.id || `feedback-${index}`}
              item={{ ...item, type: "coupdecoeur" }}
              isOpen={openId === item.id}
              /* onToggle={(id) =>
                setOpenId((prev: string | null) => (prev === id ? null : id))
              } */
            />
          ))}
        </>
      );
    }

    if (activeTab === "suggestion") {
      return (
        <>
          {(filteredData as Suggestion[]).map((item, index) => (
            <InteractiveFeedbackCard
              key={item.id || `feedback-${index}`}
              item={{ ...item, type: "suggestion" }}
              isOpen={openId === item.id}
              /* onToggle={(id) =>
                setOpenId((prev: string | null) => (prev === id ? null : id))
              } */
            />
          ))}
        </>
      );
    }

    return null;
  };

  return (
    <div className="user-feedback-view">
      <div className="feedback-filters">
        <Champs
          options={brandOptions}
          value={selectedBrand}
          onChange={setSelectedBrand}
          className="brand-select--feedback"
          brandSelect
          minWidth={225}
          minWidthPart="2"
          align="left"
          disabled={loading || brandOptions.length <= 1}
        />
      </div>

      {renderContent()}
    </div>
  );
};

export default UserFeedbackView;
