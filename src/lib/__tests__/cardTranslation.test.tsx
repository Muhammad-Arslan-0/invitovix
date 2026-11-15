import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {
  SUPPORTED_LANGUAGES,
  getLanguageMeta,
  isRtlLanguage,
} from "@/lib/i18n/languages";
import {
  BLESSING_TRANSLATIONS,
  PHRASE_TRANSLATIONS,
  UI_TRANSLATIONS,
} from "@/lib/i18n/translations";
import {
  formatLocalizedDate,
  formatLocalizedTime,
  resolveHeadline,
  resolveSubtitle,
  translateDesignData,
  translateText,
  transliterateFullName,
  transliterateMonogram,
} from "@/lib/i18n/translateService";
import {
  CardLanguageProvider,
  useCardLanguage,
} from "@/lib/i18n/CardLanguageContext";
import { GuestInviteShell } from "@/components/invitation/GuestInviteShell";
import { DEMO_EVENT } from "@/lib/templates/presets";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@lottiefiles/dotlottie-react", () => ({
  DotLottieReact: () => null,
}));

vi.mock("@/lib/audio/audioEngine", () => ({
  audioEngine: {
    resolveSource: () => "/audio/ambient-piano.wav",
    setMuted: vi.fn(),
    unlockAndPlay: vi.fn(() => true),
    toggleMute: vi.fn(() => true),
    stopAndUnload: vi.fn(),
  },
}));

class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function TestLanguageConsumer() {
  const { language, setLanguage, t, isRTL, formatDate, translatedDesignData } =
    useCardLanguage();
  return (
    <div>
      <div data-testid="current-lang">{language}</div>
      <div data-testid="is-rtl">{String(isRTL)}</div>
      <div data-testid="t-open">{t("openInvitation")}</div>
      <div data-testid="t-save">{t("saveTheDate")}</div>
      <div data-testid="headline">{translatedDesignData.content.headline}</div>
      <div data-testid="subtitle">{translatedDesignData.content.subtitle}</div>
      <div data-testid="formatted-date">
        {formatDate("2027-02-14T18:30:00.000Z", { month: "long" })}
      </div>
      <button
        type="button"
        data-testid="btn-ur"
        onClick={() => setLanguage("ur")}
      >
        Urdu
      </button>
      <button
        type="button"
        data-testid="btn-ar"
        onClick={() => setLanguage("ar")}
      >
        Arabic
      </button>
      <button
        type="button"
        data-testid="btn-fr"
        onClick={() => setLanguage("fr")}
      >
        French
      </button>
    </div>
  );
}

describe("Card Multi-Language Translation Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    globalThis.IntersectionObserver =
      MockObserver as unknown as typeof IntersectionObserver;
    globalThis.ResizeObserver =
      MockObserver as unknown as typeof ResizeObserver;
    Element.prototype.scrollIntoView = vi.fn();
    Element.prototype.scrollTo = vi.fn();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("768") || query.includes("1200"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe("Language Definitions & RTL Detection", () => {
    it("defines 11 supported celebration languages", () => {
      expect(SUPPORTED_LANGUAGES.length).toBe(11);
      const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
      expect(codes).toContain("en");
      expect(codes).toContain("ur");
      expect(codes).toContain("ar");
      expect(codes).toContain("hi");
      expect(codes).toContain("fr");
      expect(codes).toContain("es");
      expect(codes).toContain("tr");
      expect(codes).toContain("de");
      expect(codes).toContain("it");
      expect(codes).toContain("bn");
      expect(codes).toContain("id");
    });

    it("correctly identifies RTL for Urdu and Arabic, and LTR for others", () => {
      expect(isRtlLanguage("ur")).toBe(true);
      expect(isRtlLanguage("ar")).toBe(true);
      expect(isRtlLanguage("en")).toBe(false);
      expect(isRtlLanguage("fr")).toBe(false);
      expect(isRtlLanguage("hi")).toBe(false);
      expect(isRtlLanguage("id")).toBe(false);
    });

    it("safely normalizes unknown and null language codes to English", () => {
      expect(getLanguageMeta("xyz").code).toBe("en");
      expect(getLanguageMeta(null).code).toBe("en");
      expect(getLanguageMeta("UR-pk").code).toBe("ur");
    });
  });

  describe("Dictionary & Translation Resolvers", () => {
    it("contains complete UI translation sets for every language", () => {
      const keys = Object.keys(UI_TRANSLATIONS.en);
      for (const lang of SUPPORTED_LANGUAGES) {
        const dict = UI_TRANSLATIONS[lang.code];
        expect(dict).toBeDefined();
        for (const k of keys) {
          expect(dict[k as keyof typeof dict]).toBeTruthy();
        }
      }
    });

    it("translates curated Islamic blessings across languages", () => {
      const arRumUr = BLESSING_TRANSLATIONS["ayat-ar-rum"].ur;
      expect(arRumUr.translation).toContain("محبت اور رحمت");

      const arRumFr = BLESSING_TRANSLATIONS["ayat-ar-rum"].fr;
      expect(arRumFr.translation).toContain("tranquillité");

      const bismillahAr = BLESSING_TRANSLATIONS["bismillah-classic"].ar;
      expect(bismillahAr.translation).toBe("بسم الله الرحمن الرحيم");
    });

    it("translates common celebration phrases in offline mode", () => {
      const phrase = "Together with their beloved families";
      expect(translateText(phrase, "ur")).toBe("اپنے پیارے اہل خانہ کے ہمراہ");
      expect(translateText(phrase, "ar")).toBe("بمعية عائلاتهم الكريمة");
      expect(translateText(phrase, "fr")).toBe("Avec leurs familles bien-aimées");
      expect(translateText(phrase, "en")).toBe(phrase);
    });

    it("formats dates according to target locale", () => {
      const dateIso = "2027-02-14T18:30:00.000Z";
      const enDate = formatLocalizedDate(dateIso, "en-US", { month: "long" });
      expect(enDate).toContain("February");

      const frDate = formatLocalizedDate(dateIso, "fr-FR", { month: "long" });
      expect(frDate.toLowerCase()).toContain("février");
    });

    it("deep translates design data fields into selected language", () => {
      const base = DEMO_EVENT.design_data;
      const translatedUr = translateDesignData(base, "ur");

      // Host line translated
      expect(translatedUr.content.hostLine).toBe("اپنے پیارے اہل خانہ کے ہمراہ");

      // Blessing header translation updated
      expect(translatedUr.content.blessingHeader?.translation).toContain(
        "محبت اور رحمت"
      );

      // Itinerary items translated
      expect(translatedUr.content.itinerary[0].title).toBe(
        "خیر مقدمی تقریب اور سنگیت"
      );

      // Bride and groom names translated
      expect(translatedUr.content.couple.brideName).toBe("آمنہ طارق");
      expect(translatedUr.content.couple.groomName).toBe("زیان منصور");

      // Couple headline & center crest symbol translated
      expect(translatedUr.content.headline).toBe("آمنہ اور زیان");
      expect(translatedUr.content.couple.crestText).toBe("اور");

      // Wax seal monogram transliterated
      expect(translatedUr.envelope.waxSeal.monogram).toBe("آ&ز");
    });

    it("transliterates bride and groom full names across scripts", () => {
      expect(transliterateFullName("Amina Tariq", "ur")).toBe("آمنہ طارق");
      expect(transliterateFullName("Zayan Mansoor", "ur")).toBe("زیان منصور");
      expect(transliterateFullName("Fatima Noor", "ur")).toBe("فاطمہ نور");
      expect(transliterateFullName("Bilal Ahmed", "ur")).toBe("بلال احمد");

      expect(transliterateFullName("Amina Tariq", "ar")).toBe("أمينة طارق");
      expect(transliterateFullName("Zayan Mansoor", "ar")).toBe("زيان منصور");

      expect(transliterateFullName("Aarav Sharma", "hi")).toBe("आरव शर्मा");

      // Latin languages preserve spelling
      expect(transliterateFullName("Amina Tariq", "fr")).toBe("Amina Tariq");
      expect(transliterateFullName("Zayan Mansoor", "es")).toBe("Zayan Mansoor");
    });

    it("falls back to phonetic transliteration for custom names", () => {
      const res = transliterateFullName("Kamran Abbasi", "ur");
      expect(res).toContain("عباسی");
      expect(res).toContain("کامران");
    });

    it("translates couple headlines and wedding titles", () => {
      expect(resolveHeadline("Amina & Zayan", "ur")).toBe("آمنہ اور زیان");
      expect(resolveHeadline("Fatima & Bilal", "ar")).toBe("فاطمة وبلال");
      expect(resolveHeadline("Aarav & Diya", "hi")).toBe("आरव और दीया");
      expect(resolveHeadline("Elena & Matteo", "fr")).toBe("Elena & Matteo");
    });

    it("transliterates wax seal monograms into non-Latin scripts", () => {
      expect(transliterateMonogram("A&Z", "ur")).toBe("آ&ز");
      expect(transliterateMonogram("A&Z", "ar")).toBe("أ&ز");
      expect(transliterateMonogram("A&Z", "hi")).toBe("अ&ज़");
      expect(transliterateMonogram("A&Z", "fr")).toBe("A&Z");
    });

    it("harmonizes ceremony subtitle with actual itinerary events (e.g. Walima only)", () => {
      // Default subtitle with only Walima in itinerary
      const walimaOnly = [
        {
          id: "it-1",
          title: "Walima",
          time: "7:00 PM",
          description: "Dinner and celebration",
        },
      ];
      expect(
        resolveSubtitle(
          "Request the honor of your presence at their Nikah & Reception",
          walimaOnly
        )
      ).toBe("Request the honor of your presence at their Walima Reception");

      // Multiple events: Baraat & Walima
      const baraatAndWalima = [
        { id: "it-1", title: "Baraat", time: "6:00 PM", description: "" },
        { id: "it-2", title: "Walima", time: "7:00 PM", description: "" },
      ];
      expect(
        resolveSubtitle(
          "Request the honor of your presence at their Nikah & Reception",
          baraatAndWalima
        )
      ).toBe("Request the honor of your presence at their Baraat & Walima");

      // Custom subtitle entered by user is preserved
      expect(
        resolveSubtitle(
          "Join us for an intimate celebration under the stars",
          walimaOnly
        )
      ).toBe("Join us for an intimate celebration under the stars");

      // Translate design data resolves Walima subtitle in Urdu and Indonesian
      const walimaDesign = JSON.parse(JSON.stringify(DEMO_EVENT.design_data));
      walimaDesign.content.itinerary = walimaOnly;
      walimaDesign.content.subtitle =
        "Request the honor of your presence at their Nikah & Reception";

      const translatedUr = translateDesignData(walimaDesign, "ur");
      expect(translatedUr.content.subtitle).toBe(
        "ولیمہ کی پرمسرت تقریب میں آپ کی باوقار شرکت کے متمنی ہیں"
      );

      const translatedId = translateDesignData(walimaDesign, "id");
      expect(translatedId.content.subtitle).toBe(
        "Dengan hormat mengharapkan kehadiran Anda pada Resepsi Walima kami"
      );
    });
  });

  describe("CardLanguageContext & Receiver Language Selection", () => {
    it("provides language switching reactivity via useCardLanguage", () => {
      render(
        <CardLanguageProvider initialDesignData={DEMO_EVENT.design_data}>
          <TestLanguageConsumer />
        </CardLanguageProvider>
      );

      expect(screen.getByTestId("current-lang").textContent).toBe("en");
      expect(screen.getByTestId("is-rtl").textContent).toBe("false");
      expect(screen.getByTestId("t-open").textContent).toBe("Open Invitation");

      // Switch to Urdu
      fireEvent.click(screen.getByTestId("btn-ur"));
      expect(screen.getByTestId("current-lang").textContent).toBe("ur");
      expect(screen.getByTestId("is-rtl").textContent).toBe("true");
      expect(screen.getByTestId("t-open").textContent).toBe(
        "دعوت نامہ کھولیں"
      );
      expect(screen.getByTestId("t-save").textContent).toBe("تاریخ یاد رکھیں");

      // Switch to French
      fireEvent.click(screen.getByTestId("btn-fr"));
      expect(screen.getByTestId("current-lang").textContent).toBe("fr");
      expect(screen.getByTestId("is-rtl").textContent).toBe("false");
      expect(screen.getByTestId("t-open").textContent).toBe(
        "Ouvrir l'Invitation"
      );
    });
  });

  describe("GuestInviteShell Full Card Translation on Receiver Side", () => {
    it("renders English card by default and shows language selector options", () => {
      render(
        <GuestInviteShell
          eventId={DEMO_EVENT.id}
          slug={DEMO_EVENT.slug}
          title={DEMO_EVENT.title}
          eventType={DEMO_EVENT.event_type}
          eventDate={DEMO_EVENT.event_date}
          venueName={DEMO_EVENT.venue_name}
          venueAddress={DEMO_EVENT.venue_address}
          venueMapUrl={DEMO_EVENT.venue_map_url}
          audioUrl={DEMO_EVENT.audio_url}
          designData={DEMO_EVENT.design_data}
        />
      );

      // Default English texts
      expect(screen.getAllByText(/Save The Date/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Invitation/i).length).toBeGreaterThan(0);
      expect(
        screen.getAllByRole("button", { name: /Select Language/i }).length
      ).toBeGreaterThan(0);
    });

    it("translates full card view to Urdu when selected by receiver", async () => {
      render(
        <GuestInviteShell
          eventId={DEMO_EVENT.id}
          slug={DEMO_EVENT.slug}
          title={DEMO_EVENT.title}
          eventType={DEMO_EVENT.event_type}
          eventDate={DEMO_EVENT.event_date}
          venueName={DEMO_EVENT.venue_name}
          venueAddress={DEMO_EVENT.venue_address}
          venueMapUrl={DEMO_EVENT.venue_map_url}
          audioUrl={DEMO_EVENT.audio_url}
          designData={DEMO_EVENT.design_data}
        />
      );

      // Open language selector
      const langBtns = screen.getAllByRole("button", { name: /Select Language/i });
      fireEvent.click(langBtns[0]);

      // Pick Urdu
      const urduOptions = screen.getAllByRole("button", { name: /اردو/i });
      fireEvent.click(urduOptions[0]);

      // Check that Left Wing has updated to Urdu
      await waitFor(() => {
        expect(screen.getByText("تاریخ یاد رکھیں")).toBeTruthy();
      });

      // Check envelope fold has updated to Urdu
      expect(screen.getByText("دعوت نامہ")).toBeTruthy();

      // Check headline translated
      expect(screen.getAllByText("آمنہ اور زیان").length).toBeGreaterThan(0);

      // Check wax seal prompt translated
      expect(screen.getByText("دعوت نامہ کھولنے کے لیے سنہری مہر پر کلک کریں")).toBeTruthy();

      // Check host line translated
      expect(
        screen.getAllByText("اپنے پیارے اہل خانہ کے ہمراہ").length
      ).toBeGreaterThan(0);

      // Check subtitle translated
      expect(
        screen.getAllByText("نکاح اور ولیمہ کی پرمسرت تقریب میں آپ کی باوقار شرکت کے متمنی ہیں").length
      ).toBeGreaterThan(0);

      // Check right wing Concierge actions
      expect(screen.getByText("کھولیں اور جواب دیں")).toBeTruthy();
    });

    it("translates card view to French when selected by receiver", async () => {
      render(
        <GuestInviteShell
          eventId={DEMO_EVENT.id}
          slug={DEMO_EVENT.slug}
          title={DEMO_EVENT.title}
          eventType={DEMO_EVENT.event_type}
          eventDate={DEMO_EVENT.event_date}
          venueName={DEMO_EVENT.venue_name}
          venueAddress={DEMO_EVENT.venue_address}
          venueMapUrl={DEMO_EVENT.venue_map_url}
          audioUrl={DEMO_EVENT.audio_url}
          designData={DEMO_EVENT.design_data}
        />
      );

      const langBtns = screen.getAllByRole("button", { name: /Select Language/i });
      fireEvent.click(langBtns[0]);

      const frOptions = screen.getAllByRole("button", { name: /Français/i });
      fireEvent.click(frOptions[0]);

      await waitFor(() => {
        expect(screen.getByText("Réservez la Date")).toBeTruthy();
      });

      expect(screen.getByText("Ouvrir et Confirmer")).toBeTruthy();
    });

    it("respects initialLang prop when provided in direct link", () => {
      render(
        <GuestInviteShell
          eventId={DEMO_EVENT.id}
          slug={DEMO_EVENT.slug}
          title={DEMO_EVENT.title}
          eventType={DEMO_EVENT.event_type}
          eventDate={DEMO_EVENT.event_date}
          venueName={DEMO_EVENT.venue_name}
          venueAddress={DEMO_EVENT.venue_address}
          venueMapUrl={DEMO_EVENT.venue_map_url}
          audioUrl={DEMO_EVENT.audio_url}
          designData={DEMO_EVENT.design_data}
          initialLang="ar"
        />
      );

      // Renders directly in Arabic
      expect(screen.getByText("احفظوا التاريخ")).toBeTruthy();
      expect(screen.getByText("دعوة")).toBeTruthy();
      expect(screen.getByText("فتح وتأكيد الحضور")).toBeTruthy();
    });

    it("translates card view to Indonesian when selected by receiver", async () => {
      render(
        <GuestInviteShell
          eventId={DEMO_EVENT.id}
          slug={DEMO_EVENT.slug}
          title={DEMO_EVENT.title}
          eventType={DEMO_EVENT.event_type}
          eventDate={DEMO_EVENT.event_date}
          venueName={DEMO_EVENT.venue_name}
          venueAddress={DEMO_EVENT.venue_address}
          venueMapUrl={DEMO_EVENT.venue_map_url}
          audioUrl={DEMO_EVENT.audio_url}
          designData={DEMO_EVENT.design_data}
        />
      );

      const langBtns = screen.getAllByRole("button", { name: /Select Language/i });
      fireEvent.click(langBtns[0]);

      const idOptions = screen.getAllByRole("button", { name: /Bahasa Indonesia/i });
      fireEvent.click(idOptions[0]);

      await waitFor(() => {
        expect(screen.getByText("Simpan Tanggalnya")).toBeTruthy();
      });

      expect(screen.getByText("Undangan")).toBeTruthy();
      expect(screen.getByText("Buka & RSVP")).toBeTruthy();
    });
  });
});
