import { useState, useMemo } from "react";
import { FiFile, FiUpload, FiDownload, FiX } from "react-icons/fi";
import BackButton from "../components/BackButton";
import { useAppContext } from "../context/AppContext";
import { downloadRecordAPI } from "../services/allAPI";

const HealthRecords = () => {
  const { records, addRecord, user } = useAppContext();

  const [fileName, setFileName] = useState("");
  const [fileCategory, setFileCategory] = useState("lab-report");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDownload = async (recordId) => {
    if (!user || !user.token) return;
    try {
      const reqHeader = { "Authorization": `Bearer ${user.token}` };
      const result = await downloadRecordAPI(recordId, reqHeader);
      if (result.ok) {
        const blob = await result.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = records.find(r => (r._id || r.id) === recordId)?.filename || 'record';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading record:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFileName(selectedFile.name);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setUploading(true);
    try {
      const result = await addRecord({
        filename: fileName,
        date: new Date().toISOString().split("T")[0],
        category: fileCategory,
      }, file);

      if (result && result.success) {
        setMessage("Record uploaded successfully!");
        setFileName("");
        setFileCategory("lab-report");
        setFile(null);
        e.target.reset();
      } else {
        setMessage(result?.message || "Failed to upload record");
      }
    } catch (error) {
      setMessage("Error uploading file");
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const filteredRecords = useMemo(() => {
    let data = records;

    if (searchQuery)
      data = data.filter((r) =>
        r.filename.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (filterCategory !== "all")
      data = data.filter((r) => r.category === filterCategory);

    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [records, searchQuery, filterCategory]);

  return (
    <div className="space-y-6 p-4">
      <BackButton />
      <h1 className="text-2xl font-semibold text-secondary">Health Records</h1>

      {/* UPLOAD FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-5 shadow"
      >
        <h2 className="text-xl font-semibold mb-4">Upload Record</h2>

        <select
          value={fileCategory}
          onChange={(e) => setFileCategory(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="lab-report">Lab Report</option>
          <option value="prescription">Prescription</option>
          <option value="imaging">Imaging</option>
          <option value="vaccination">Vaccination</option>
          <option value="other">Other</option>
        </select>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-accent/60 bg-accent/20 p-8 rounded-xl cursor-pointer">
          <FiUpload className="text-3xl text-secondary" />
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {fileName && (
          <div className="flex justify-between items-center bg-gray-50 p-3 mt-3 rounded-lg">
            <span className="text-sm">{fileName}</span>
            <button
              type="button"
              onClick={() => {
                setFileName("");
                document.querySelector("input[type=file]").value = "";
              }}
              className="text-gray-500 hover:text-red-500"
            >
              <FiX />
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={!fileName || uploading}
          className="w-full bg-primary text-white p-3 mt-4 rounded-full disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Save Record"}
        </button>
        
        {message && (
          <p className={`mt-3 text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>

      {/* RECORD LIST */}
      <div className="bg-white rounded-xl p-5 shadow">
        <h2 className="text-xl font-semibold mb-4">
          Uploaded Files ({records.length})
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border p-2 mb-4 rounded-lg"
        />

        {/* Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full border p-2 mb-4 rounded-lg"
        >
          <option value="all">All</option>
          <option value="lab-report">Lab Reports</option>
          <option value="prescription">Prescriptions</option>
          <option value="imaging">Imaging</option>
          <option value="vaccination">Vaccinations</option>
          <option value="other">Others</option>
        </select>

        {filteredRecords.length ? (
          <ul className="space-y-3">
            {filteredRecords.map((rec) => {
              const recordId = rec._id || rec.id;
              return (
                <li
                  key={recordId}
                  className="flex justify-between items-start bg-gray-50 p-4 rounded-lg"
                >
                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <FiFile /> {rec.filename}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{rec.category}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {rec.date} • {rec.size || 'N/A'}
                    </p>
                  </div>

                  {rec.fileUrl && (
                    <button 
                      onClick={() => handleDownload(recordId)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg"
                      title="Download"
                    >
                      <FiDownload />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-6">No records found</p>
        )}
      </div>
    </div>
  );
};

export default HealthRecords;
