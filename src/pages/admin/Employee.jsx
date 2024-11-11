import React, { useEffect, useState } from "react";
import toaster from "react-hot-toast";
import { checkLogin } from "../../utils/Utils";
import { useNavigate } from "react-router-dom";
import apiClient from "../../apiClient";

export default function Component() {
  const navigate = useNavigate();
  const userRole = checkLogin();
  if (userRole != "admin") {
    navigate("/");
  }
  const staffId = localStorage.getItem("staffId");
  const shopId = localStorage.getItem("shopId");
  const method = staffId == "null" ? "post" : "put";
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailPhone: "",
    address: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (staffId == "null") return;
      try {
        const response = await apiClient.get(`/account/staff/${staffId}/`);
        const data = response.data;
        // console.log(data);
        setFormData({
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          emailPhone: data.user.email
            ? data.user.email
            : data.user.phone_number,
          address: data.address,
        });
      } catch (error) {}
    };

    if (staffId) {
      fetchData();
    }
  }, [staffId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhoneNumber(phone) {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let email, phone;
    let emailPhone = formData.emailPhone;

    if (emailPhone.includes("@")) {
      if (!isValidEmail(emailPhone)) {
        toaster.error("Enter a valid email");
        return;
      }
    } else {
      if (!isValidPhoneNumber(emailPhone)) {
        toaster.error("Enter a valid phone number");
        return;
      }
    }

    if (formData.emailPhone.includes("@")) email = formData.emailPhone;
    else phone = formData.emailPhone;
    setLoading(true);
    if (method == "put") {
      apiClient
        .put(`/account/staff/${staffId}/`, {
          user: {
            email: email,
            phone_number: phone,
            password: "password",
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
          address: formData.address,
          store: shopId,
        })
        .then((res) => {
          setLoading(false);
          navigate("/admin/");
          localStorage.removeItem("staffId");
          toaster.success("Employee saved!");
        })
        .catch((res) => {
          setLoading(false);
          toaster.error("An error occurred!");
        });
    } else {
      apiClient
        .post("/account/staff/", {
          user: {
            email: email,
            phone_number: phone,
            password: "password",
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
          address: formData.address,
          store: shopId,
        })
        .then((res) => {
          setLoading(false);
          navigate("/admin/");
          localStorage.removeItem("staffId");
          toaster.success("Employee saved!");
        })
        .catch((res) => {
          setLoading(false);
          toaster.error("An error occurred!");
        });
    }
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="w-screen md:w-[80vw] space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <div className="flex gap-4 items-center w-full justify-center">
            {/* logo */}
            <div className="flex gap-2">
              <div className="w-12 h-12 transform scale-[80%] bg-purple-500 rounded-full flex items-center justify-center">
                <svg
                  className="fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={32}
                >
                  <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
                </svg>
              </div>
              <div className="flex text-xs font-extrabold flex-col justify-center">
                <span className="text-violet-500">Rotessoft</span>{" "}
                <span className="text-violet-500">
                  P<span className="mx-1.5">.</span>O
                  <span className="mx-1.5">.</span>S
                </span>
              </div>
            </div>

            {/* login text */}
            <h2 className="text-2xl font-bold text border-l pl-3 border-black text-gray-800">
              Staff Info
            </h2>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <div className="py-5 sm:p-6 rounded-md">
              <h3 className="text-lg font-medium half-underline w-fit pb-1 border-violet-500 leading-6 text-gray-900 mb-5">
                Submit
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>

                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="rounded-none rounded-e-lg focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="rounded-none rounded-e-lg focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="emailPhone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email or phone
                  </label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 16"
                      >
                        <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                        <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="emailPhone"
                      id="emailPhone"
                      autoComplete="email"
                      required
                      value={formData.emailPhone}
                      onChange={handleChange}
                      className="rounded-none rounded-e-lg focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                      >
                        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      autoComplete="street-address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      className="rounded-none rounded-e-lg focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[50%] flex gap-2">
            <button
              type="submit"
              className="w-fit flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Submit Information"
              )}
            </button>
            <p
              onClick={() => navigate("/admin/")}
              className="w-fit flex cursor-pointer justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
