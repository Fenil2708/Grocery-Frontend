"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import Search from "@/app/admin/components/Search";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Image from "next/image";
import { RiEdit2Line } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa"
import Link from "next/link";
import { deleteData, fetchDataFromApi } from "@/admin-utils/api";
import { MyContext } from "@/admin-context/ThemeProvider";

const columns = [
  { id: "IMAGE", label: "IMAGE", minWidth: 100 },
  { id: "CATEGORYNAME", label: "CATEGORY NAME", minWidth: 200 }, 
  { id: "COLOR", label: "COLOR", minWidth: 100 },
  { id: "ACTIONS", label: "ACTIONS", minWidth: 150 },
];

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const context = useContext(MyContext);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = (search = "") => {
    setIsLoading(true);
    let url = "/api/category?adminView=true";
    if (search) {
      url += `&search=${search}`;
    }
    fetchDataFromApi(url).then((res) => {
      setIsLoading(false);
      if (res.success) {
        setCategories(res.data);
      }
    }).catch(err => {
      setIsLoading(false);
      console.error(err);
    });
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  }

  const handleSearch = () => {
    getCategories(searchQuery);
  }


  const deleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setIsLoading(true);
      deleteData(`/api/category/${id}`).then((res) => {
        setIsLoading(false);
        if (res.success) {
          context?.alertBox("success", "Category Deleted Successfully");
          getCategories();
        } else {
          context?.alertBox("error", res.message || "Failed to delete category");
        }
      }).catch(err => {
        setIsLoading(false);
        console.error(err);
        context?.alertBox("error", "Failed to delete category");
      });
    }
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <section className="w-full py-3 px-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-[18px] text-gray-700 font-[600]">Category List</h2>
        <Link href={"/admin/category-list/add-category"} className="w-full sm:w-auto">
          <Button className="btn-g w-full sm:w-auto" size="small">
            Add Category
          </Button>
        </Link>
      </div>

      <div className="w-full p-4 rounded-md shadow-md bg-white mt-3">
        <div className="flex flex-col md:flex-row items-center justify-between mb-5 gap-4">
          <h3 className="text-[16px] text-gray-700 font-[600]">Manage Categories</h3>
          <div className="w-full md:max-w-[400px]">
            <Search 
              width="100%" 
              placeholder="Search category..." 
              onChange={handleSearchChange} 
              onClick={handleSearch}
              value={searchQuery}
            />
          </div>
        </div>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    className="!bg-gray-100 !font-bold"
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" className="py-10">
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : (
                  categories?.length > 0 ? (
                    categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cat, index) => {
                      return (
                        <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                          <TableCell data-label="IMAGE" className="!py-4">
                             <div className="img bg-white rounded-xl border border-slate-100 overflow-hidden w-[60px] h-[60px] shadow-sm p-1 shrink-0 mx-auto md:mx-0">
                                <Image
                                    src={cat.images[0] || "/p1.png"}
                                    alt={cat.name}
                                    width={60}
                                    height={60}
                                    className="w-full h-full object-cover rounded-lg"
                                    unoptimized
                                />
                             </div>
                          </TableCell>

                          <TableCell data-label="CATEGORY NAME">
                            <span className="font-black text-slate-800 text-[15px]">{cat.name}</span>
                          </TableCell>

                          <TableCell data-label="COLOR">
                             <div className="flex items-center gap-2 justify-end md:justify-start">
                                <div className="w-5 h-5 rounded-lg border-2 border-white shadow-sm ring-1 ring-slate-200" style={{backgroundColor: cat.color}}></div>
                                <span className="text-[12px] font-black tabular-nums text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md uppercase tracking-widest">{cat.color}</span>
                             </div>
                          </TableCell>

                          <TableCell data-label="ACTIONS">
                            <div className="flex items-center gap-1 justify-end md:justify-start">
                              <Link href={`/admin/category-list/edit/${cat._id}`}>
                                <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-2xl !bg-primary/10 !text-primary hover:!bg-primary hover:!text-white transition-all shadow-sm">
                                  <RiEdit2Line size={18} />
                                </Button>
                              </Link>
                              <Link href={`/products?category=${cat._id}`} target="_blank">
                                <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-2xl !bg-green-50 !text-green-600 hover:!bg-green-600 hover:!text-white transition-all shadow-sm">
                                  <IoEyeOutline size={20} />
                                </Button>
                              </Link>
                              <Button 
                                className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-2xl !bg-red-50 !text-red-500 hover:!bg-red-600 hover:!text-white transition-all shadow-sm"
                                onClick={() => deleteCategory(cat._id)}
                              >
                                <FaRegTrashAlt size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" className="py-10 text-gray-500">
                        No categories found.
                      </TableCell>
                    </TableRow>
                  )
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </section>
  );
};

export default CategoryList;
