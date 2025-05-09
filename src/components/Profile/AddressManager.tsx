"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MapPin, Trash2, Pencil, X } from "lucide-react";
import AddAddressForm from "@/components/Addressmanager/AddAddressForm";

type Address = {
  address_id: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  floor_no: string;
  landmark: string;
};

export const AddressManager = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<Address | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/addresses", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setAddresses(data);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
      setAddresses([]);
    }
  };

  const deleteAddress = async (id: number) => {
    toast.warning("Are you sure you want to delete this address?", {
      action: {
        label: "Yes, Delete",
        onClick: async () => {
          try {
            const res = await fetch(
              `http://localhost:5000/api/users/addresses/${id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            const data = await res.json();
            if (res.ok) {
              toast.success("Address deleted");
              fetchAddresses();
            } else {
              toast.error("Failed: " + data.error);
            }
          } catch {
            toast.error("Error deleting address");
          }
        },
      },
    });
  };

  const setAsDefault = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
  
      // 1. Fetch full address data first
      const fetchRes = await fetch(`http://localhost:5000/api/users/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const allData = await fetchRes.json();
      const current = allData.find((a: any) => a.address_id === id);
  
      if (!current) return toast.error("Address not found");
  
      // 2. Submit full data with only is_default = true
      const res = await fetch(`http://localhost:5000/api/users/addresses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...current,
          is_default: true,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        toast.success("Default address updated");
        fetchAddresses();
      } else {
        toast.error("Failed: " + data.error);
      }
    } catch (err) {
      toast.error("Error updating address");
    }
  };
  

  return (
    <div className="bg-white rounded-2xl p-6 space-y-6 border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Your Addresses</h2>
        <Button
          variant="outline"
          className="text-sm border-[#8BAD2B] text-[#8BAD2B] hover:bg-[#f6fef2]"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X className="w-4 h-4 mr-1" /> : "➕"}{" "}
          {showForm ? "Cancel" : "Add New Address"}
        </Button>
      </div>

      {/* Toggleable Add Form */}
      {showForm && (
        <div className=" rounded-xl bg-gray-50 p-5">
          <AddAddressForm
            mode="add"
            onSuccess={() => {
              fetchAddresses();
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* Address Cards */}
      {addresses.length === 0 ? (
        <p className="text-gray-500 text-sm">No saved addresses yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.address_id}
              className="rounded-xl border border-gray-200 border-t-[4px] border-t-[#8BAD2B] p-5 shadow-sm bg-white"
            >
              <div className="flex items-center gap-2 text-[#8BAD2B] font-medium text-sm mb-1">
                <MapPin className="w-4 h-4" />
                <span>{addr.name}</span>
                {addr.is_default && (
                  <span className="ml-auto text-xs bg-[#e9f8d9] text-[#6d871b] px-2 py-0.5 rounded-full border border-[#cdeca3]">
                    Default
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-700 leading-tight mb-4">
                <p>{addr.address_line1}</p>
                {addr.address_line2 && <p>{addr.address_line2}</p>}
                <p>
                  {addr.city}, {addr.state} {addr.pincode}
                </p>
              </div>

              <div className="flex items-center justify-between border-t pt-3 text-sm">
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setEditData(addr);
                      setEditOpen(true);
                    }}
                    className="text-gray-600 hover:text-black flex items-center gap-1"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => deleteAddress(addr.address_id)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
                {!addr.is_default && (
                  <button
                    onClick={() => setAsDefault(addr.address_id)}
                    className="text-[#8BAD2B] font-medium hover:underline text-xs"
                  >
                    Set as default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl bg-white p-6 rounded-xl shadow-xl">
          <DialogTitle>Edit Address</DialogTitle> {/* ✅ Add this */}
          {editData && (
            <AddAddressForm
              mode="edit"
              initialData={editData}
              onSuccess={() => {
                fetchAddresses();
                setEditOpen(false);
              }}
              onCancel={() => setEditOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
