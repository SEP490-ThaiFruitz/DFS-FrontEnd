"use client";

import type React from "react";

import { useState } from "react";
import {
  User,
  MapPin,
  Home,
  Building2,
  Edit,
  Trash2,
  PlusCircle,
  ChevronRight,
  ArrowLeft,
  FileUser,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

// Mock data for existing addresses
const mockAddresses = [
  {
    id: "1",
    name: "Nhà riêng",
    street: "123 Đường Nguyễn Huệ",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    postalCode: "70000",
    phone: "0901234567",
    isDefault: true,
  },
  {
    id: "2",
    name: "Văn phòng",
    street: "456 Đường Lê Lợi",
    district: "Quận 3",
    city: "TP. Hồ Chí Minh",
    postalCode: "70000",
    phone: "0909876543",
    isDefault: false,
  },
];

type Address = {
  id?: string;
  name: string;
  street: string;
  district: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
};

export default function AddressChoices() {
  const [activeTab, setActiveTab] = useState("personal");
  const [addressMode, setAddressMode] = useState("select"); // "select", "create", or "edit"
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    name: "",
    street: "",
    district: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.id]: e.target.value,
    });
    // Clear error when user types
    if (errors[e.target.id]) {
      setErrors({
        ...errors,
        [e.target.id]: "",
      });
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (addressMode === "create") {
      setNewAddress({
        ...newAddress,
        [e.target.name]: e.target.value,
      });
    } else if (addressMode === "edit" && editingAddress) {
      setEditingAddress({
        ...editingAddress,
        [e.target.name]: e.target.value,
      });
    }

    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validatePersonalInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!personalInfo.firstName.trim()) {
      newErrors.firstName = "Vui lòng nhập họ";
    }

    if (!personalInfo.lastName.trim()) {
      newErrors.lastName = "Vui lòng nhập tên";
    }

    if (!personalInfo.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!personalInfo.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(personalInfo.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddress = (address: Address) => {
    const newErrors: Record<string, string> = {};

    if (!address.name.trim()) {
      newErrors.name = "Vui lòng nhập tên địa chỉ";
    }

    if (!address.street.trim()) {
      newErrors.street = "Vui lòng nhập địa chỉ đường phố";
    }

    if (!address.district.trim()) {
      newErrors.district = "Vui lòng nhập quận/huyện";
    }

    if (!address.city.trim()) {
      newErrors.city = "Vui lòng nhập tỉnh/thành phố";
    }

    if (!address.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(address.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = () => {
    if (addressMode === "create") {
      if (!validateAddress(newAddress)) return;

      // Generate a unique ID for the new address
      const newId = `${Date.now()}`;
      const addressToAdd = {
        ...newAddress,
        id: newId,
        isDefault: addresses.length === 0,
      };

      setAddresses([...addresses, addressToAdd]);
      setSelectedAddress(newId);
      setNewAddress({
        name: "",
        street: "",
        district: "",
        city: "",
        postalCode: "",
        phone: "",
      });
      toast("Địa chỉ của bạn đã được lưu thành công.");
    } else if (addressMode === "edit" && editingAddress) {
      if (!validateAddress(editingAddress)) return;

      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id ? editingAddress : addr
        )
      );
      setSelectedAddress(editingAddress.id || "");
      toast.success("Thay đổi của bạn đã được lưu thành công.");
    }

    setAddressMode("select");
    setEditingAddress(null);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressMode("edit");
  };

  const handleDeleteAddress = (id: string) => {
    const updatedAddresses = addresses.filter((addr) => addr.id !== id);
    setAddresses(updatedAddresses);

    // If the deleted address was selected, select another one
    if (selectedAddress === id) {
      setSelectedAddress(updatedAddresses[0]?.id || "");
    }

    toast("Địa chỉ đã được xóa khỏi danh sách của bạn.");
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );

    toast("Địa chỉ mặc định của bạn đã được thay đổi");
  };

  const handleContinue = () => {
    if (activeTab === "personal") {
      if (validatePersonalInfo()) {
        setActiveTab("address");
      }
    } else if (activeTab === "address") {
      if (!selectedAddress && addressMode === "select") {
        setErrors({ address: "Vui lòng chọn hoặc tạo một địa chỉ" });
        return;
      }

      // Here you would typically proceed to the next step (payment, etc.)
      setIsSubmitting(true);

      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        toast("Bạn sẽ được chuyển đến trang thanh toán");
      }, 1500);
    }
  };

  const getSelectedAddressDetails = () => {
    return addresses.find((addr) => addr.id === selectedAddress);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Thanh toán</h1>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span
              className={
                activeTab === "personal" ? "text-primary font-medium" : ""
              }
            >
              Thông tin cá nhân
            </span>
            <ChevronRight className="h-4 w-4" />
            <span
              className={
                activeTab === "address" ? "text-primary font-medium" : ""
              }
            >
              Địa chỉ giao hàng
            </span>
            <ChevronRight className="h-4 w-4" />
            <span>Thanh toán</span>
          </div>
        </div>
        <Separator />
      </div> */}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="base-info" className="flex items-center gap-2">
            <FileUser className="h-4 w-4" />
            Thông tin cơ bản
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger value="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Địa chỉ giao hàng
          </TabsTrigger>
        </TabsList>

        <TabsContent value="base-info">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản của bạn</CardTitle>
              <CardDescription>
                Hãy đảm bảo thông tin cơ bản của bạn chính xác
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-0">
                  <h1>Tên của bạn: </h1>

                  <h2>Đặng Hữu Phúc</h2>
                </div>

                <div className="flex items-center gap-0">
                  <h1>Email: </h1>

                  <h2>danghuuphuc001@gmail.com</h2>
                </div>

                <div className="flex items-center gap-0">
                  <h1>Số điện thoại </h1>

                  <h2>0123444999</h2>
                </div>

                <div className="flex items-center gap-0">
                  <h1>Địa chỉ: </h1>

                  <h2>FPT Quận 9</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân của bạn</CardTitle>
              <CardDescription>
                Hãy đảm bảo thông tin cá nhân của bạn chính xác khi tiến hành
                thanh toán
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={handlePersonalInfoChange}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-destructive">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={handlePersonalInfoChange}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-destructive">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleContinue} className="w-full">
                Tiếp tục <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Địa chỉ giao hàng</CardTitle>
                  <CardDescription>
                    Chọn địa chỉ giao hàng hoặc tạo địa chỉ mới
                  </CardDescription>
                </div>
                {addressMode === "select" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAddressMode("create");
                      setErrors({});
                    }}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" /> Thêm địa chỉ mới
                  </Button>
                )}
                {(addressMode === "create" || addressMode === "edit") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAddressMode("select");
                      setEditingAddress(null);
                      setErrors({});
                    }}
                    className="flex items-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" /> Quay lại
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {addressMode === "select" && (
                <>
                  {addresses.length === 0 ? (
                    <Alert>
                      <AlertDescription>
                        Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <RadioGroup
                        value={selectedAddress}
                        onValueChange={setSelectedAddress}
                        className="space-y-3"
                      >
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`relative flex flex-col p-4 border rounded-md transition-all ${
                              selectedAddress === address.id
                                ? "border-primary bg-primary/5"
                                : "hover:border-muted-foreground/20"
                            }`}
                          >
                            <div className="absolute right-4 top-4 flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleEditAddress(address);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {addresses.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteAddress(address.id || "");
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="flex items-start gap-3">
                              <RadioGroupItem
                                value={address.id || ""}
                                id={`address-${address.id}`}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Label
                                    htmlFor={`address-${address.id}`}
                                    className="font-medium text-base cursor-pointer"
                                  >
                                    {address.name}
                                  </Label>
                                  {address.isDefault && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Mặc định
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  {address.street}, {address.district},{" "}
                                  {address.city} {address.postalCode}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  SĐT: {address.phone}
                                </p>

                                {!address.isDefault &&
                                  selectedAddress === address.id && (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="p-0 h-auto mt-2 text-xs"
                                      onClick={() =>
                                        handleSetDefaultAddress(
                                          address.id || ""
                                        )
                                      }
                                    >
                                      Đặt làm địa chỉ mặc định
                                    </Button>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>

                      {errors.address && (
                        <p className="text-sm text-destructive">
                          {errors.address}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              {(addressMode === "create" || addressMode === "edit") && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address-name">Tên địa chỉ</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={
                          (addressMode === "create" &&
                            newAddress.name === "Nhà riêng") ||
                          (addressMode === "edit" &&
                            editingAddress?.name === "Nhà riêng")
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          if (addressMode === "create") {
                            setNewAddress({ ...newAddress, name: "Nhà riêng" });
                          } else if (editingAddress) {
                            setEditingAddress({
                              ...editingAddress,
                              name: "Nhà riêng",
                            });
                          }
                        }}
                        className="flex items-center gap-1"
                      >
                        <Home className="h-4 w-4" /> Nhà riêng
                      </Button>
                      <Button
                        type="button"
                        variant={
                          (addressMode === "create" &&
                            newAddress.name === "Văn phòng") ||
                          (addressMode === "edit" &&
                            editingAddress?.name === "Văn phòng")
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          if (addressMode === "create") {
                            setNewAddress({ ...newAddress, name: "Văn phòng" });
                          } else if (editingAddress) {
                            setEditingAddress({
                              ...editingAddress,
                              name: "Văn phòng",
                            });
                          }
                        }}
                        className="flex items-center gap-1"
                      >
                        <Building2 className="h-4 w-4" /> Văn phòng
                      </Button>
                    </div>
                    <Input
                      id="address-name"
                      name="name"
                      placeholder="Hoặc nhập tên địa chỉ khác"
                      value={
                        addressMode === "create"
                          ? newAddress.name
                          : editingAddress?.name || ""
                      }
                      onChange={handleAddressChange}
                      className={`mt-2 ${
                        errors.name ? "border-destructive" : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Địa chỉ đường phố</Label>
                    <Input
                      id="street"
                      name="street"
                      placeholder="Số nhà, tên đường"
                      value={
                        addressMode === "create"
                          ? newAddress.street
                          : editingAddress?.street || ""
                      }
                      onChange={handleAddressChange}
                      className={errors.street ? "border-destructive" : ""}
                    />
                    {errors.street && (
                      <p className="text-sm text-destructive">
                        {errors.street}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district">Quận/Huyện</Label>
                      <Input
                        id="district"
                        name="district"
                        value={
                          addressMode === "create"
                            ? newAddress.district
                            : editingAddress?.district || ""
                        }
                        onChange={handleAddressChange}
                        className={errors.district ? "border-destructive" : ""}
                      />
                      {errors.district && (
                        <p className="text-sm text-destructive">
                          {errors.district}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Tỉnh/Thành phố</Label>
                      <Input
                        id="city"
                        name="city"
                        value={
                          addressMode === "create"
                            ? newAddress.city
                            : editingAddress?.city || ""
                        }
                        onChange={handleAddressChange}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Mã bưu điện</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={
                          addressMode === "create"
                            ? newAddress.postalCode
                            : editingAddress?.postalCode || ""
                        }
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressPhone">Số điện thoại</Label>
                      <Input
                        id="addressPhone"
                        name="phone"
                        type="tel"
                        value={
                          addressMode === "create"
                            ? newAddress.phone
                            : editingAddress?.phone || ""
                        }
                        onChange={handleAddressChange}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleSaveAddress}
                    className="w-full"
                  >
                    {addressMode === "create"
                      ? "Lưu địa chỉ mới"
                      : "Cập nhật địa chỉ"}
                  </Button>
                </div>
              )}
            </CardContent>
            {/* {addressMode === "select" && (
              <CardFooter>
                <Button
                  onClick={handleContinue}
                  className="w-full"
                  disabled={isSubmitting || addresses.length === 0}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                      Đang xử lý...
                    </span>
                  ) : (
                    <>
                      Tiếp tục thanh toán{" "}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            )} */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
