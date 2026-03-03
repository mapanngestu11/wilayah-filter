import { useLoaderData, Form, useSubmit, Link } from 'react-router-dom';

export async function wilayahLoader({ request }) {
  const url = new URL(request.url);
  const pId = url.searchParams.get("province");
  const rId = url.searchParams.get("regency");
  const dId = url.searchParams.get("district");

  // Fetch data sesuai instruksi tambahan
  const response = await fetch('/data/indonesia_regions.json');
  const data = await response.json();

  const provinces = data.provinces || [];
  const allRegencies = data.regencies || [];
  const allDistricts = data.districts || [];

  // Filter hirarkis
  const filteredRegencies = allRegencies.filter(r => r.province_id === Number(pId));
  const filteredDistricts = allDistricts.filter(d => d.regency_id === Number(rId));

  return { 
    provinces, 
    regencies: filteredRegencies, 
    districts: filteredDistricts, 
    pId, rId, dId 
  };
}

export default function FilterPage() {
  const { provinces, regencies, districts, pId, rId, dId } = useLoaderData();
  const submit = useSubmit();

  // Mencari label wilayah untuk Breadcrumb & Main Content
  const currentProv = provinces.find(p => p.id === Number(pId))?.name;
  const currentReg = regencies.find(r => r.id === Number(rId))?.name;
  const currentDist = districts.find(d => d.id === Number(dId))?.name;

  const handleFilterChange = (event) => {
    const form = event.currentTarget.form;
    const { name } = event.target;

    // Reset parameter anak jika induk berubah agar filter tetap akurat
    const url = new URL(window.location.href);
    if (name === "province") {
      url.searchParams.delete("regency");
      url.searchParams.delete("district");
    } else if (name === "regency") {
      url.searchParams.delete("district");
    }

    window.history.replaceState({}, "", url);
    submit(form);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      {/* 1. Breadcrumb - Menggunakan class breadcrumb */}
      <nav className="breadcrumb mb-8 text-sm flex gap-2 text-blue-600 font-medium">
        <Link to="/" className="hover:text-blue-800 transition">Beranda</Link>
        {currentProv && <span> / {currentProv}</span>}
        {currentReg && <span> / {currentReg}</span>}
        {currentDist && <span> / {currentDist}</span>}
      </nav>

      {/* 2. Filter Wilayah */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
        <Form method="get" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dropdown Provinsi - name: province */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-gray-400">Provinsi</label>
            <select name="province" value={pId || ""} onChange={handleFilterChange} className="border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none transition-all">
              <option value="">-- Pilih Provinsi --</option>
              {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Dropdown Kota - name: regency */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-gray-400">Kota/Kabupaten</label>
            <select name="regency" value={rId || ""} disabled={!pId} onChange={handleFilterChange} className="border p-3 rounded-xl bg-gray-50 disabled:opacity-50 transition-all">
              <option value="">-- Pilih Kota --</option>
              {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          {/* Dropdown Kecamatan - name: district */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-gray-400">Kecamatan</label>
            <select name="district" value={dId || ""} disabled={!rId} onChange={(e) => submit(e.currentTarget.form)} className="border p-3 rounded-xl bg-gray-50 disabled:opacity-50 transition-all">
              <option value="">-- Pilih Kecamatan --</option>
              {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <Link to="/" className="text-red-500 font-bold px-6 py-2 rounded-lg hover:bg-red-50 transition">
              Reset Filter
            </Link>
          </div>
        </Form>
      </div>

      {/* 3. Konten Utama - Menggunakan tag <main> */}
      <main className="bg-white h-64 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 shadow-inner">
        <h3 className="text-gray-400 mb-2">Lokasi Terpilih</h3>
        <p className="text-4xl font-black text-blue-950 tracking-tight">
          {currentDist || currentReg || currentProv || "Belum Ada Pilihan"}
        </p>
        {currentProv && (
          <p className="mt-4 text-sm text-gray-500 italic">
            Menampilkan data untuk wilayah {currentProv}
          </p>
        )}
      </main>
    </div>
  );
}