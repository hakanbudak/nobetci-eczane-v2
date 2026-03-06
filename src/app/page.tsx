import HomeView from "@/components/pharmacy/HomeView";
import LocationDetector from "@/components/common/LocationDetector";
import { fetchOnDutyPharmacies } from "@/services/pharmacyService";

export const revalidate = 43200;

export default async function HomePage() {
  let pharmacies: any[] = [];
  try {
    pharmacies = await fetchOnDutyPharmacies("istanbul");
  } catch (e) {
    pharmacies = [];
  }

  return (
    <>
      <HomeView initialPharmacies={pharmacies} initialCitySlug="istanbul" initialCityName="İstanbul" />
      <LocationDetector />
    </>
  );
}
