"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Image from "next/image";
import { RiEdit2Line } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa"
import Link from "next/link";
import { deleteData, fetchDataFromApi } from "@/admin-utils/api";
import { MyContext } from "@/admin-context/ThemeProvider";

const columns = [
  { id: "IMAGE", label: "IMAGE", minWidth: 300 },
  { id: "LINKED_TO", label: "LINKED TO", minWidth: 200 },
  { id: "ACTIONS", label: "ACTIONS", minWidth: 200 },
];

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(MyContext);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = () => {
    setIsLoading(true);
    fetchDataFromApi("/api/banner").then((res) => {
      setBanners(res.data);
      setIsLoading(false);
    });
  };

  const deleteBanner = (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      deleteData(`/api/banner/${id}`).then((res) => {
        if (res.success) {
          context?.alertBox("success", "Banner Deleted Successfully");
          getBanners();
        } else {
          context?.alertBox("error", res.message || "Failed to delete banner");
        }
      });
    }
  };

  return (
    <section className="w-full py-3 px-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] text-gray-700 font-[600]">Banner Slides</h2>
        <Link href={"/admin/banners/add-banner"}>
          <Button className="btn-g" size="small">
            Add Banner
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
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                banners?.map((banner, index) => (
                  <TableRow key={index}>
                    <TableCell className="!px-0">
                      <div className="flex items-center gap-3">
                        <div className="img bg-white rounded-md overflow-hidden border">
                          <Image
                            src={banner.images[0]}
                            alt="banner image"
                            width={300}
                            height={100}
                            className="object-cover hover:scale-105 transition-all h-[100px] w-auto"
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {banner.category ? (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Category: {banner.category.name}
                        </span>
                      ) : banner.product ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Product: {banner.product.name}
                        </span>
                      ) : (
                         <span className="text-gray-400">None</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/banners/edit/${banner._id}`}>
                          <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-gray-900">
                            <RiEdit2Line size={20} />
                          </Button>
                        </Link>
                        <Button 
                          className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-gray-900"
                          onClick={() => deleteBanner(banner._id)}
                        >
                          <FaRegTrashAlt size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  );
};

export default Banners;
