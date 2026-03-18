"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button, Select, MenuItem, Checkbox, Rating, CircularProgress } from "@mui/material";
import Search from "../Search";

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
import { fetchDataFromApi, deleteData } from "@/admin-utils/api";
import { MyContext } from "@/admin-context/ThemeProvider";

const label = { inputProps: { "aria-label": "checkbox-demo" } };

const columns = [
  { id: "PRODUCT", label: "PRODUCT", minWidth: 300 },
  { id: "CATEGORY", label: "CATEGORY", minWidth: 100 },
  { id: "PRICE", label: "PRICE", minWidth: 100 },
  { id: "STOCK", label: "STOCK", minWidth: 100 },
  { id: "RATING", label: "RATING", minWidth: 100 },
  { id: "ACTIONS", label: "ACTIONS", minWidth: 200 },
];

const ProductsComponent = () => {
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [productData, setProductData] = useState([]);
  const [catData, setCatData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const context = useContext(MyContext);

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  useEffect(() => {
    getProducts(category);
  }, [category]);

  const getProducts = (catId = "", search = "") => {
    setIsLoading(true);
    let url = "/api/product?adminView=true";
    if (catId && catId !== "") {
      url += `&category=${catId}`;
    }
    if (search && search !== "") {
      url += `&search=${search}`;
    }

    fetchDataFromApi(url).then((res) => {
      setProductData(res?.data);
      setIsLoading(false);
    });
  };

  const getCategories = () => {
    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res?.data);
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    getProducts(category, searchQuery);
  };

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteData(`/api/product/${id}`).then((res) => {
        if (res.success) {
          context?.alertBox("success", "Product deleted successfully!");
          getProducts();
        } else {
          context?.alertBox("error", res.message || "Failed to delete product");
        }
      });
    }
  };

  return (
    <section className="w-full py-2">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-[18px] text-gray-700 font-[600]">Products</h2>
        <Link href={"/admin/products-list/add-product"} className="w-full sm:w-auto">
          <Button className="btn-g w-full sm:w-auto" size="small">
            Add Product
          </Button>
        </Link>
      </div>

      <div className="w-full p-4 rounded-md shadow-md bg-white mt-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-3">
          <div className="col w-full md:w-[200px]">
            <h6 className="mb-1 text-[14px] text-gray-700">Category By</h6>
            <Select
              value={category}
              onChange={handleChangeCategory}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              size="small"
              className="w-full"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {catData?.length !== 0 &&
                catData?.map((item, index) => {
                  return (
                    <MenuItem key={index} value={item._id}>
                      {item.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </div>
          <div className="col w-full md:flex-1 md:max-w-[400px]">
            <h6 className="mb-1 text-[14px] text-gray-700 md:hidden">Search</h6>
            <Search
              width="400px"
              placeholder="Search products..."
              onChange={onSearchChange}
              onClick={handleSearch}
              value={searchQuery}
            />
          </div>
        </div>

        <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox {...label} size="small" />
                </TableCell>
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
                  <TableCell colSpan={7} align="center" className="py-10">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                productData
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((product, index) => {
                    return (
                      <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                        <TableCell padding="checkbox">
                          <Checkbox {...label} size="small" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="img p-1 bg-white rounded-md border border-gray-100">
                              <Image
                                src={product.images[0] || "/p1.png"}
                                alt="product image"
                                width={50}
                                height={70}
                                className="object-cover h-[70px] w-[50px]"
                                unoptimized
                              />
                            </div>
                            <div className="info">
                              <h3 className="text-[13px] text-gray-800 font-[600]">
                                {product.name?.substr(0, 40)}...
                              </h3>
                              <span className="text-gray-700 text-[13px]">{product.brand}</span>
                              {product.sku_id && (
                                <span className="text-gray-500 text-[11px] block mt-1">SKU: {product.sku_id}</span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>{product.category?.name || "N/A"}</TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-[#CB0000] text-[14px] font-[600]">
                              ${product.price}
                            </span>
                            <span className="text-[#A4A4A4] text-[14px] font-[600] line-through">
                              ${product.oldPrice}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-primary font-bold">
                            {product.countInStock}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Rating
                            name="read-only"
                            value={product.rating}
                            readOnly
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Link href={`/admin/products-list/edit/${product._id}`}>
                              <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-gray-900">
                                <RiEdit2Line size={20} />
                              </Button>
                            </Link>
                            <Link href={`http://localhost:3000/product/${product._id}`} target="_blank">
                              <Button className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-gray-900">
                                <IoEyeOutline size={20} />
                              </Button>
                            </Link>
                            <Button
                              className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-gray-900"
                              onClick={() => deleteProduct(product._id)}
                            >
                              <FaRegTrashAlt size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={productData?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </section>
  );
};

export default ProductsComponent;
