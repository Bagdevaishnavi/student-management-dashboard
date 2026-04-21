  "use client";
  import {
    FaEdit,
    FaUsers,
    FaUserGraduate,
    FaUserCircle,
    FaSearch,
  } from "react-icons/fa";
  import { MdGirl } from "react-icons/md";
  import { MdDelete } from "react-icons/md";
  import { IoMale, IoFemale } from "react-icons/io5";
  import { MdBoy } from "react-icons/md";
  import React, { useEffect, useState } from "react";
  import "bootstrap/dist/css/bootstrap.min.css";

  const Page = () => {
    const [studentData, setStudentData] = useState({});
    const [errors, setErrors] = useState({});
    const [list, setlist] = useState([]);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const limit = 5;

    useEffect(() => {
      const data = JSON.parse(localStorage.getItem("newlist")) || [];
      setlist(data);
    }, []);

    const handlechange = (e) => {
      const { name, value } = e.target;
      setStudentData({ ...studentData, [name]: value });
    };

    const validate = () => {
      let err = {};
      if (!studentData.name) err.name = "Name required";
      if (!studentData.email) err.email = "Email required";
      else if (!/\S+@\S+\.\S+/.test(studentData.email))
        err.email = "Invalid email";
      setErrors(err);
      return Object.keys(err).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!validate()) return;

      if (editId !== null) {
        const updated = list.map((item) =>
          item.id === editId ? { ...studentData, id: editId } : item
        );
        setlist(updated);
        localStorage.setItem("newlist", JSON.stringify(updated));
        setEditId(null);
      } else {
        const newData = [...list, { ...studentData, id: Date.now() }];
        setlist(newData);
        localStorage.setItem("newlist", JSON.stringify(newData));
      }

      setStudentData({});
      setErrors({});
    };

    const handleDelete = (id) => {
      if (!confirm("Delete student?")) return;
      const filtered = list.filter((item) => item.id !== id);
      setlist(filtered);
      localStorage.setItem("newlist", JSON.stringify(filtered));
    };

    const handleEdit = (item) => {
      setStudentData(item);
      setEditId(item.id);
    };

    let filteredList = list.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "asc") filteredList.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "desc") filteredList.sort((a, b) => b.name.localeCompare(a.name));

    useEffect(() => {
      setCurrentPage(1);
    }, [search, sort]);

    const totalPages = Math.ceil(filteredList.length / limit);
    const start = (currentPage - 1) * limit;
    const paginatedData = filteredList.slice(start, start + limit);

    const total = list.length;
    const male = list.filter((s) => s.gender === "male").length;
    const female = list.filter((s) => s.gender === "female").length;

    return (
      <div style={{ background: "#f6f8fb", minHeight: "100vh" }}>

       {/* HEADER */}
<div className="bg-white shadow-sm py-3 mb-4">
  <div className="container d-flex justify-content-between align-items-center">

    {/* LEFT SIDE */}
    <div className="d-flex align-items-center gap-3">
      <div className="bg-dark text-white rounded p-2">
        <FaUserGraduate />
      </div>
      <div>
        <h5 className="mb-0 fw-bold">Student Dashboard</h5>
        <small className="text-muted">Manage student records</small>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="d-flex align-items-center gap-3">

      {/* Notification Icon */}
      <div className="position-relative">
        <FaUsers className="text-secondary" size={18} />
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -6,
            width: 8,
            height: 8,
            background: "red",
            borderRadius: "50%",
          }}
        ></span>
      </div>

      {/* User Info */}
      <div className="d-flex align-items-center gap-2">

        {/* Avatar */}
        <div
          className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center"
          style={{
            width: 36,
            height: 36,
            fontSize: 14,
            fontWeight: "bold",
          }}
        >
          VB
        </div>

        {/* Name + Role */}
        <div className="d-none d-sm-block">
          <div className="fw-semibold" style={{ fontSize: 14 }}>
            Admin
          </div>
          <small className="text-muted">Dashboard User</small>
        </div>
      </div>

    </div>
  </div>
</div>

        <div className="container">

          {/* STATS */}
          <div className="row g-3 mb-4">
            {[{ icon: <FaUsers className="fs-5" />, label: "Total", value: total },
              { icon: <MdBoy className="fs-5"/>, label: "Male", value: male },
              { icon: <MdGirl className="fs-5" />, label: "Female", value: female }
            ].map((card, i) => (
              <div className="col-md-4" key={i}>
                <div className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3">
                  <div className="bg-light p-2 rounded">{card.icon}</div>
                  <div>
                    <small className="text-muted">{card.label}</small>
                    <h6 className="mb-0 fw-bold">{card.value}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">

            {/* FORM */}
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 p-4 h-100">

                <h6 className="fw-bold mb-3">
                  {editId ? "Edit Student" : "Add Student"}
                </h6>

                <form onSubmit={handleSubmit}>

                  <input className={`form-control mb-2 ${errors.name && "is-invalid"}`} placeholder="Full Name" name="name" value={studentData.name || ""} onChange={handlechange}/>
                  <div className="invalid-feedback">{errors.name}</div>

                  <input className={`form-control mb-2 ${errors.email && "is-invalid"}`} placeholder="Email" name="email" value={studentData.email || ""} onChange={handlechange}/>
                  <div className="invalid-feedback">{errors.email}</div>

                  <div className="row g-2">
                    <div className="col-6">
                      <input className="form-control" placeholder="Roll" name="roll" value={studentData.roll || ""} onChange={handlechange}/>
                    </div>
                    <div className="col-6">
                      <input className="form-control" placeholder="Phone" name="phone" value={studentData.phone || ""} onChange={handlechange}/>
                    </div>
                  </div>

                  <textarea className="form-control my-2" placeholder="Address" name="address" value={studentData.address || ""} onChange={handlechange}/>

                  <div className="row g-2">
                    <div className="col-6">
                      <select className="form-select" name="gender" value={studentData.gender || ""} onChange={handlechange}>
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <select className="form-select" name="course" value={studentData.course || ""} onChange={handlechange}>
                        <option value="">Course</option>
                        <option>BCA</option>
                        <option>BSC.IT</option>
                        <option>MCA</option>
                        <option>MSC.IT</option>
                      </select>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-dark w-100">
                      {editId ? "Update" : "Save"}
                    </button>
                    <button type="button" className="btn btn-light border" onClick={() => {
                      setStudentData({});
                      setEditId(null);
                      setErrors({});
                    }}>
                      Clear
                    </button>
                  </div>

                </form>
              </div>
            </div>

            {/* TABLE */}
            <div className="col-lg-8">
              <div className="card shadow-sm border-0">

                {/* SEARCH */}
                <div className="card-body border-bottom d-flex justify-content-between align-items-center">
                  <strong>Students ({filteredList.length})</strong>

                  <div className="d-flex gap-2 align-items-center">
                    <div className="input-group">
                      <span className="input-group-text bg-white">
                        <FaSearch size={12} />
                      </span>
                      <input
                        className="form-control"
                        placeholder="Search name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>

                    <select className="form-select" style={{ width: 120 }} onChange={(e) => setSort(e.target.value)}>
                      <option value="">Sort</option>
                      <option value="asc">A-Z</option>
                      <option value="desc">Z-A</option>
                    </select>
                  </div>
                </div>

                {/* TABLE */}
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Roll</th>
                        <th>Phone</th>
                        <th>Course</th>
                        <th>Gender</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedData.map((item, i) => (
                        <tr key={item.id}>
                          <td>{start + i + 1}</td>
                          <td className="fw-semibold">{item.name}</td>
                          <td className="text-muted">{item.email}</td>
                          <td>{item.roll || "-"}</td>
                          <td>{item.phone || "-"}</td>
                          <td>{item.course || "-"}</td>
                          <td>
                            {item.gender === "male" ? (
                              <span className="badge bg-primary px-2 py-1"><MdBoy  size={12}/> Male</span>
                            ) : item.gender === "female" ? (
                              <span className="badge bg-danger px-2 py-1"><MdGirl size={12} /> Female</span>
                            ) : "-"}
                          </td>
                          <td className="text-end">
                            <button className="btn btn-sm btn-light border me-1" onClick={() => handleEdit(item)}>
                              <FaEdit size={12}/>
                            </button>
                            <button className="btn btn-sm btn-light border text-danger" onClick={() => handleDelete(item.id)}>
                              <MdDelete size={14}/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* PAGINATION */}
                <div className="p-3 d-flex justify-content-between align-items-center border-top">
                  <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    ← Prev
                  </button>

                  <small className="text-muted">
                    Page {currentPage} of {totalPages || 1}
                  </small>

                  <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)}>
                    Next →
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  export default Page;