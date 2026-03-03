import { useLoaderData, Form, useSubmit, Link } from "react-router-dom";

// DATA DUMMY GABUNGAN
const provinces = [
  { "id": 1, "name": "Kepulauan Riau" },
  { "id": 2, "name": "DKI Jakarta" },
  { "id": 3, "name": "Bali" }
];

const regencies = [
  { "id": 1, "name": "Kota Batam", "province_id": 1 },
  { "id": 2, "name": "Kota Tanjung Pinang", "province_id": 1 },
  { "id": 3, "name": "Jakarta Selatan", "province_id": 2 },
  { "id": 4, "name": "Jakarta Barat", "province_id": 2 },
  { "id": 5, "name": "Kota Denpasar", "province_id": 3 },
  { "id": 6, "name": "Badung", "province_id": 3 }
];

const districts = [
  { "id": 1, "name": "Batam Kota", "regency_id": 1 },
  { "id": 2, "name": "Batu Ampar", "regency_id": 1 },
  { "id": 3, "name": "Belakang Padang", "regency_id": 1 },
  { "id": 4, "name": "Bukit Bestari", "regency_id": 2 },
  { "id": 5, "name": "Tanjung Pinang Barat", "regency_id": 2 },
  { "id": 6, "name": "Tanjung Pinang Kota", "regency_id": 2 },
  { "id": 7, "name": "Kebayoran Baru", "regency_id": 3 },
  { "id": 8, "name": "Kebayoran Lama", "regency_id": 3 },
  { "id": 9, "name": "Cilandak", "regency_id": 3 },
  { "id": 10, "name": "Kebon Jeruk", "regency_id": 4 },
  { "id": 11, "name": "Tamansari", "regency_id": 4 },
  { "id": 12, "name": "Grogol Petamburan", "regency_id": 4 },
  { "id": 13, "name": "Denpasar Selatan", "regency_id": 5 },
  { "id": 14, "name": "Denpasar Barat", "regency_id": 5 },
  { "id": 15, "name": "Denpasar Utara", "regency_id": 5 },
  { "id": 16, "name": "Kuta", "regency_id": 6 },
  { "id": 17, "name": "Kuta Selatan", "regency_id": 6 },
  { "id": 18, "name": "Kuta Utara", "regency_id": 6 }
];

export async function wilayahLoader({ request }) {
  const url = new URL(request.url);
  const pId = url.searchParams.get("province");
  const rId = url.searchParams.get("regency");
  const dId = url.searchParams.get("district");

  return {
    provinces,
    regencies: regencies.filter(r => r.province_id === Number(pId)),
    districts: districts.filter(d => d.regency_id === Number(rId)),
    pId, rId, dId
  };
}

export default function WilayahPage() {
  const { provinces, regencies, districts, pId, rId, dId } = useLoaderData();
  const submit = useSubmit();

  const selProv = provinces.find(p => p.id === Number(pId))?.name;
  const selReg = regencies.find(r => r.id === Number(rId))?.name;
  const selDist = districts.find(d => d.id === Number(dId))?.name;

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-left">
      <nav className="breadcrumb mb-4 text-blue-600 flex gap-2 italic">
        <Link to="/">Home</Link>
        {selProv && <span>/ {selProv}</span>}
        {selReg && <span>/ {selReg}</span>}
        {selDist && <span>/ {selDist}</span>}
      </nav>

      <Form method="get" className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-bold mb-1">Provinsi</label>
          <select 
            name="province" 
            value={pId || ""} 
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.delete("regency");
              url.searchParams.delete("district");
              window.history.replaceState({}, "", url);
              submit(e.currentTarget.form);
            }} 
            className="w-full border p-2 rounded"
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-bold mb-1">Kota/Kabupaten</label>
          <select 
            name="regency" 
            value={rId || ""} 
            disabled={!pId}
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.delete("district");
              window.history.replaceState({}, "", url);
              submit(e.currentTarget.form);
            }} 
            className="w-full border p-2 rounded"
          >
            <option value="">Pilih Kota</option>
            {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-bold mb-1">Kecamatan</label>
          <select 
            name="district" 
            value={dId || ""} 
            disabled={!rId}
            onChange={(e) => submit(e.currentTarget.form)} 
            className="w-full border p-2 rounded"
          >
            <option value="">Pilih Kecamatan</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div className="md:col-span-3 flex justify-end">
          <Link to="/" className="bg-red-500 text-white px-4 py-2 rounded">Reset Filter</Link>
        </div>
      </Form>

      <main className="mt-8 bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold">Wilayah Terpilih:</h1>
        <p className="text-xl text-blue-700 mt-2 font-semibold">
          {selDist ? `${selDist}, ${selReg}, ${selProv}` : 
           selReg ? `${selReg}, ${selProv}` : 
           selProv ? selProv : "Belum memilih wilayah"}
        </p>
      </main>
    </div>
  );
}