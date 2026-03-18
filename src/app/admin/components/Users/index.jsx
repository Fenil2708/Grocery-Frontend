"use client";
import React, { useEffect, useState } from "react";
import { Button, Select, MenuItem, Checkbox, Rating } from "@mui/material";
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
import { MdOutlineEmail, MdOutlinePhone, MdOutlineDateRange } from "react-icons/md";

import { fetchDataFromApi, deleteData } from "@/admin-utils/api";
import { MyContext } from "@/admin-context/ThemeProvider";
import { CircularProgress } from "@mui/material";

const label = { inputProps: { "aria-label": "checkbox-demo" } };

const columns = [
  { id: "USER", label: "USER", minWidth: 250 },
  { id: "ROLE", label: "ROLE", minWidth: 100 },
  { id: "PHONE NUMBER", label: "PHONE", minWidth: 150 },
  { id: "CREATED AT", label: "JOINED", minWidth: 150 },
  { id: "ACTIONS", label: "ACTIONS", minWidth: 150 },
];

const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const context = React.useContext(MyContext);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = (search = "") => {
    setIsLoading(true);
    let url = "/api/user/all";
    if (search) {
      url += `?search=${search}`;
    }
    fetchDataFromApi(url).then((res) => {
      if (res.success) {
        setUsers(res.data);
      }
      setIsLoading(false);
    });
  };

  const onSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    getUsers(searchQuery);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteData(`/api/user/${id}`).then((res) => {
        if (res.success) {
          context?.alertBox("success", "User deleted successfully!");
          getUsers();
        } else {
          context?.alertBox("error", res.message || "Failed to delete user");
        }
      });
    }
  };

  return (
    <section className="w-full">
      <div className="w-full p-4 rounded-md shadow-md bg-white mt-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
          <div className="col w-full sm:w-[200px] text-center sm:text-left">
            <h2 className="text-[18px] text-gray-700 font-[600]">Users</h2>
          </div>
          <div className="col w-full sm:max-w-[400px]">
            <Search 
              width="100%" 
              placeholder="Search user..." 
              onChange={onSearchChange}
              onClick={handleSearch}
              value={searchQuery}
            />
          </div>
        </div>

        <TableContainer sx={{ maxHeight: 440 }}>
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
                  <TableCell colSpan={6} align="center" className="py-10">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                users
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((user, index) => {
                    return (
                      <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                        <TableCell padding="checkbox">
                          <Checkbox {...label} size="small" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="img p-1 bg-white rounded-md border border-gray-100">
                              <Image
                                src={user.avatar ? `${process.env.NEXT_PUBLIC_APP_API_URL}/uploads/${user.avatar}` : "/profile.jpg"}
                                alt="user profile"
                                width={40}
                                height={40}
                                className="object-cover rounded-full h-[40px] w-[40px]"
                                unoptimized
                              />
                            </div>
                            <div className="info">
                              <h3 className="text-[13px] text-gray-800 font-[600]">
                                {user.name}
                              </h3>
                              <span className="text-gray-700 text-[12px] flex items-center gap-1">
                                <MdOutlineEmail size={16} />
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-md text-[12px] font-bold ${
                              user.role === "ADMIN"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {user.role}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MdOutlinePhone size={18} />
                            <span className="text-gray-700 text-[13px]">
                              {user.mobile || "N/A"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MdOutlineDateRange size={18} />
                            <span className="text-gray-700 text-[13px]">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-gray-900">
                              <RiEdit2Line size={18} />
                            </Button>
                            <Button className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-gray-900">
                              <IoEyeOutline size={18} />
                            </Button>
                            <Button
                              className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !text-red-600"
                              onClick={() => deleteUser(user._id)}
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
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </section>
  );
};

export default UsersComponent;
