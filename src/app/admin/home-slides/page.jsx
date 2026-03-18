"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";


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

const label = { inputProps: { "aria-label": "checkbox-demo" } };

const columns = [
  { id: "IMAGE", label: "IMAGE", minWidth: 300 },
  { id: "LINKED_TO", label: "LINKED TO", minWidth: 200 },
  { id: "ACTIONS", label: "ACTIONS", minWidth: 200 },
];

const HomeSlides = () => {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);

  useEffect(() => {
    getSlides();
  }, []);

  const getSlides = () => {
    setIsLoading(true);
    fetchDataFromApi("/api/homeSlider").then((res) => {
      setIsLoading(false);
      if (res.success) {
        setSlides(res.data);
      }
    }).catch(err => {
      setIsLoading(false);
      console.error(err);
    });
  }

  const deleteSlide = (id) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      setIsLoading(true);
      deleteData(`/api/homeSlider/${id}`).then((res) => {
        setIsLoading(false);
        if (res.success) {
          context?.alertBox("success", "Slide Deleted Successfully");
          getSlides();
        } else {
          context?.alertBox("error", res.message || "Failed to delete slide");
        }
      }).catch(err => {
        setIsLoading(false);
        console.error(err);
        context?.alertBox("error", "Failed to delete slide");
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
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] text-gray-700 font-[600]">Home Slides</h2>
        <Link href={"/admin/home-slides/add-home-slide"}>
          <Button className="btn-g" size="small">
            Add Home Slide
          </Button>
        </Link>
      </div>

      <div className="w-full p-4 rounded-md shadow-md bg-white mt-3">
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
                    <TableCell colSpan={3} align="center" className="py-10">
                      <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : (
                  slides?.length > 0 ? (
                    slides.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((slide, index) => {
                      return (
                        <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                          <TableCell className="!py-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {
                                slide.images?.map((img, i) => (
                                  <div key={i} className="img bg-white rounded-md border border-gray-200 overflow-hidden w-[100px] h-[60px]">
                                    <img
                                      src={img}
                                      alt="slide image"
                                      className="w-full h-full object-cover hover:scale-110 transition-all cursor-pointer"
                                    />
                                  </div>
                                ))
                              }
                            </div>
                          </TableCell>

                          <TableCell>
                            {slide.category ? (
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                Category: {slide.category.name}
                              </span>
                            ) : slide.product ? (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                Product: {slide.product.name}
                              </span>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Link href={`/admin/home-slides/edit/${slide._id}`}>
                                <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-blue-600 bg-blue-50 hover:bg-blue-100">
                                  <RiEdit2Line size={20} />
                                </Button>
                              </Link>
                              <Button 
                                className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-red-600 bg-red-50 hover:bg-red-100"
                                onClick={() => deleteSlide(slide._id)}
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
                      <TableCell colSpan={3} align="center" className="py-10 text-gray-500">
                        No slides found.
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
          count={slides.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </section>
  );
};

export default HomeSlides;
