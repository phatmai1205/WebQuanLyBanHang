/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Copy, CheckCircle2, ChevronLeft, ChevronDown, X, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import defaultData from "./defaultData.json";

type ViewState =
  | "login"
  | "signup_1"
  | "signup_2"
  | "signup_3"
  | "signup_4"
  | "success";

const BUSINESS_TYPES = [
  "Thời trang",
  "Điện thoại & Điện máy",
  "Vật liệu xây dựng",
  "Nhà thuốc",
  "Mẹ & Bé",
  "Sách & Văn phòng phẩm",
  "Sản xuất",
  "Tạp hóa & Siêu thị",
  "Mỹ phẩm",
  "Nông sản & Thực phẩm",
  "Xe, Máy móc",
  "Nội thất & Gia dụng",
  "Hoa & Quà tặng",
  "Khác",
  "Nhà hàng",
  "Quán ăn",
  "Cafe, Trà sữa",
  "Karaoke, Bida",
  "Bar, Pub & Club",
  "Căng tin & Trạm dừng nghỉ",
  "Beauty Spa & Massage",
  "Hair Salon & Nails",
  "Khách sạn & Nhà nghỉ",
  "Homestay & Villa, Resort",
  "Fitness & Yoga",
  "Phòng khám",
];

export default function App() {
  const [view, setView] = useState<ViewState>("login");
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      const sess = localStorage.getItem("adminLogged") || sessionStorage.getItem("adminLogged");
      setHasSession(!!sess);
    };
    checkSession();
    window.addEventListener("adminLoggedChanged", checkSession);
    return () => {
      window.removeEventListener("adminLoggedChanged", checkSession);
    };
  }, []);

  if (hasSession) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased text-gray-900">
      {view === "login" && <LoginView setView={setView} />}
      {view === "signup_1" && <SignupStep1 setView={setView} />}
      {view === "signup_2" && <SignupStep2 setView={setView} />}
      {view === "signup_3" && <SignupStep3 setView={setView} />}
      {view === "signup_4" && <SignupStep4 setView={setView} />}
      {view === "success" && <SuccessScreen setView={setView} />}
    </div>
  );
}

function LoginView({ setView }: { setView: (v: ViewState) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Load accounts from global registry
    let registryStr = localStorage.getItem("adminAccountsRegistry");
    let accounts: any[] = [];
    if (registryStr) {
      accounts = JSON.parse(registryStr);
    } else {
      // Initialize if not exists
      let legacyData = JSON.parse(localStorage.getItem("adminAppData") || "{}");
      accounts = legacyData.TAIKHOAN || defaultData.TAIKHOAN || [];
      accounts = accounts.map((tk: any) => {
        if (!tk.storeOwner) {
          tk.storeOwner = (tk.username === "admin" || tk.username.startsWith("NV")) ? "admin" : tk.username;
        }
        return tk;
      });
      localStorage.setItem("adminAccountsRegistry", JSON.stringify(accounts));
    }

    const acc = accounts.find(
      (tk: any) =>
        tk.username === username &&
        tk.password === password &&
        tk.TrangThai !== "Đã Thu Hồi"
    );

    if (acc) {
      const storeOwner = acc.storeOwner || (acc.username === "admin" || acc.username.startsWith("NV") ? "admin" : acc.username);
      
      const currentUser = {
        username: acc.username,
        Quyen: acc.Quyen,
        MaNV: acc.MaNV,
        TenNV: acc.TenNV,
        storeOwner: storeOwner
      };
      localStorage.setItem("adminLogged", JSON.stringify(currentUser));
      sessionStorage.setItem("adminLogged", JSON.stringify(currentUser));
      (window as any).currentUser = currentUser;
      
      // Merge legacy data for admin if they are loading empty dashboard
      if (acc.username === "admin") {
        let appData = JSON.parse(localStorage.getItem("adminAppData") || "{}");
        if (!appData.KHACHHANG || appData.KHACHHANG.length === 0) {
          appData = {
            ...appData,
            ...defaultData,
            TAIKHOAN: [
              ...defaultData.TAIKHOAN
            ],
          };
          localStorage.setItem("adminAppData", JSON.stringify(appData));
        }
      }

      if (typeof (window as any).loadAppData === "function") {
        (window as any).loadAppData();
      }

      const rootEl = document.getElementById("root");
      if (rootEl) rootEl.style.display = "none";
      const appContainer = document.getElementById("app-container");
      if (appContainer) appContainer.style.display = "flex";
      
      if (typeof (window as any).initSystem === "function") {
        (window as any).initSystem();
      }
      
      window.dispatchEvent(new Event("adminLoggedChanged")); 
    } else {
      setError("Sai thông tin đăng nhập!");
    }
  };

  return (
    <>
      <div className="w-full max-w-[600px] min-h-[450px] bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm flex flex-col justify-center items-center relative">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-8">
            <h1 className="text-5xl font-extrabold text-[#003087] italic tracking-tighter">
              MTP
            </h1>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                className="w-full h-14 px-5 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0079C1] focus:border-transparent transition-all bg-white"
                placeholder="Email or mobile number"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                className="w-full h-14 px-5 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0079C1] focus:border-transparent transition-all bg-white"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0079C1] hover:bg-[#005a93] text-white text-lg font-bold h-14 rounded transition-colors mt-6"
            >
              Log In
            </button>
          </form>

          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="w-full text-[#0079C1] hover:underline text-base block text-center my-4 font-medium transition-colors cursor-pointer focus:outline-none"
          >
            Having trouble logging in?
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-gray-400 font-medium bg-white text-sm">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={() => setView("signup_1")}
            className="w-full bg-gray-50 hover:bg-gray-100 text-[#0079C1] border border-gray-300 text-lg font-bold h-14 rounded-md transition-all"
          >
            Sign Up
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showHelp && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0079C1]/10 flex items-center justify-center text-[#0079C1]">
                    <HelpCircle className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Trợ giúp Đăng nhập</h3>
                    <p className="text-xs text-slate-500">MTP Support Assistant</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 overflow-y-auto space-y-6">
                {/* Visual indicator */}
                <div className="flex flex-col items-center text-center space-y-4 py-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#0079C1]/15 blur-md animate-ping" />
                    <div className="w-20 h-20 rounded-full bg-blue-50 border border-[#0079C1]/20 flex items-center justify-center relative shadow-sm">
                      <span className="text-4xl">⚙️</span>
                    </div>
                  </div>
                  <div>
                    <span className="px-3 py-1 text-xs font-semibold tracking-wider text-[#0079C1] uppercase bg-[#0079C1]/10 rounded-full">
                      Đang phát triển
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-800 text-center">
                    Tính năng đang được nâng cấp
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed text-center sm:text-justify">
                    Xin chào! Tính năng <strong>Phục hồi mật khẩu</strong> và <strong>Trợ giúp đăng nhập</strong> tự động qua SMS/Email hiện tại đang được phát triển nâng cấp và hoàn thiện hệ thống bảo mật.
                  </p>
                  
                  <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
                    <span className="text-lg mt-0.5">💡</span>
                    <p className="text-amber-800 text-xs leading-relaxed">
                      <strong>Bạn có thể tự tạo tài khoản mới:</strong> Sử dụng nút <strong>Sign Up</strong> trực tiếp trên màn hình đăng nhập để tạo ngay một cửa hàng riêng biệt của bạn chỉ trong vài giây!
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <span className="font-semibold text-slate-700 text-sm block">Bạn có thể thực hiện nhanh:</span>
                  <div className="space-y-3 text-xs text-slate-600">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center shrink-0">1</div>
                      <span>Nhấp vào <strong>Sign Up</strong> để đăng ký tài khoản mới bằng số điện thoại của bạn.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center shrink-0">2</div>
                      <span>Sử dụng tài khoản demo mặc định để khám phá hệ thống: <strong>admin / 123</strong>.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 gap-3 flex flex-col sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  className="w-full bg-[#0079C1] hover:bg-[#005a93] text-white text-sm font-semibold h-11 rounded-lg transition-colors cursor-pointer"
                >
                  Tôi đã hiểu (Đóng)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SignupStep1({ setView }: { setView: (v: ViewState) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Mật khẩu phải có tối thiểu 8 chữ/số.");
      return;
    }
    if (!agree) {
      setError("Bạn cần đồng ý với điều khoản sử dụng.");
      return;
    }

    // Check if phone number is already registered
    let registryStr = localStorage.getItem("adminAccountsRegistry");
    let accounts: any[] = [];
    if (registryStr) {
      accounts = JSON.parse(registryStr);
    } else {
      let legacyData = JSON.parse(localStorage.getItem("adminAppData") || "{}");
      accounts = legacyData.TAIKHOAN || defaultData.TAIKHOAN || [];
    }

    const isDuplicate = accounts.some(
      (acc: any) => acc.username === phone || acc.username === phone.trim()
    );

    if (isDuplicate) {
      setError("Số điện thoại này đã được đăng ký. Vui lòng sử dụng số điện thoại khác.");
      return;
    }

    // Save to window state temporarily
    (window as any).__signupData = { name, phone: phone.trim(), password };
    setView("signup_2");
  };

  return (
    <div className="w-full max-w-[600px] min-h-[450px] p-8 sm:p-12 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center relative animate-fade-in">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900">
          Tạo tài khoản dùng thử miễn phí
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleNext} className="space-y-4">
          <div className="border border-gray-300 rounded overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all h-14">
            <input
              type="text"
              className="w-full h-full px-5 text-lg focus:outline-none bg-white"
              placeholder="Nhập họ tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex border border-gray-300 rounded overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all h-14">
            <div className="flex items-center px-4 bg-gray-50 border-r border-gray-200 shrink-0">
              <span className="text-xl">🇻🇳</span>
              <ChevronDown className="w-4 h-4 ml-1.5 text-gray-500" />
            </div>
            <input
              type="tel"
              className="w-full h-full px-5 text-lg focus:outline-none bg-transparent"
              placeholder="091 234 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="border border-gray-300 rounded overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all h-14">
            <input
              type="password"
              className="w-full h-full px-5 text-lg focus:outline-none bg-white"
              placeholder="Mật khẩu (Tối thiểu 8 ký tự)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer py-2 select-none">
            <div className="pt-1">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white cursor-pointer"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
            </div>
            <span className="text-sm text-gray-600">
              Tôi đã đọc và đồng ý <a href="#" className="font-semibold text-blue-600 hover:underline">Điều khoản và chính sách sử dụng</a> của MTP
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-[#0070f3] hover:bg-blue-600 text-white text-lg font-bold h-14 rounded transition-colors mt-6"
          >
            Tiếp tục
          </button>
        </form>
      </div>
    </div>
  );
}

function SignupStep2({ setView }: { setView: (v: ViewState) => void }) {
  const [role, setRole] = useState("Chưa chọn");
  const [name, setName] = useState("");
  const [businessType, setBusinessType] = useState("Thời trang");

  useEffect(() => {
    if ((window as any).__signupData) {
      setName((window as any).__signupData.name || "");
    }
  }, []);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    (window as any).__signupData = {
      ...(window as any).__signupData,
      role,
      name,
      businessType,
    };
    setView("signup_3");
  };

  return (
    <div className="w-full max-w-[600px] min-h-[450px] p-8 sm:p-12 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center relative animate-fade-in">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8 w-full">
          <button
            type="button"
            onClick={() => setView("signup_1")}
            className="flex items-center text-base font-semibold text-[#0079C1] hover:underline transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-0.5" /> Quay lại
          </button>
          <div className="flex items-center gap-3">
            <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#0070f3] w-1/3 h-full rounded-full"></div>
            </div>
            <span className="text-base font-medium text-gray-500 whitespace-nowrap">
              1/3
            </span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900 leading-tight">
          Chào mừng đến MTP
        </h2>

        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Quý khách là
            </label>
            <div className="relative border border-gray-300 rounded overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all h-14">
              <select
                className="w-full h-full px-5 text-lg appearance-none focus:outline-none bg-transparent pr-12 text-gray-800"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Chưa chọn">Chưa chọn</option>
                <option value="Anh">Anh</option>
                <option value="Chị">Chị</option>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Họ tên
            </label>
            <div className="border border-gray-300 rounded overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all h-14">
              <input
                type="text"
                className="w-full h-full px-5 text-lg focus:outline-none bg-white text-gray-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ tên"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
              Ngành hàng
            </label>
            <div className="relative border border-gray-300 rounded overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all h-14">
              <select
                className="w-full h-full px-5 text-lg appearance-none focus:outline-none bg-transparent pr-12 text-gray-800"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              >
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#0070f3] hover:bg-blue-600 text-white text-lg font-bold h-14 rounded transition-colors"
            >
              Tiếp tục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SignupStep3({ setView }: { setView: (v: ViewState) => void }) {
  const [timeInBusiness, setTimeInBusiness] = useState("Sắp mở");
  const [channels, setChannels] = useState<string[]>([]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    (window as any).__signupData = {
      ...(window as any).__signupData,
      timeInBusiness,
      channels,
    };
    setView("signup_4");
  };

  const toggleChannel = (ch: string) => {
    if (channels.includes(ch)) {
      setChannels(channels.filter((c) => c !== ch));
    } else {
      setChannels([...channels, ch]);
    }
  };

  return (
    <div className="w-full max-w-[600px] min-h-[450px] p-8 sm:p-12 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center relative animate-fade-in">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8 w-full">
          <button
            type="button"
            onClick={() => setView("signup_2")}
            className="flex items-center text-base font-semibold text-[#0079C1] hover:underline transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-0.5" /> Quay lại
          </button>
          <div className="flex items-center gap-3">
            <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#0070f3] w-2/3 h-full rounded-full"></div>
            </div>
            <span className="text-base font-medium text-gray-500 whitespace-nowrap">
              2/3
            </span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-900 leading-tight">
          Thời gian kinh doanh
        </h2>

        <form onSubmit={handleNext} className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {["Sắp mở", "1-5 năm", "Trên 5 năm"].map((t) => (
              <div
                key={t}
                onClick={() => setTimeInBusiness(t)}
                className={`cursor-pointer rounded border p-3 text-center text-base font-semibold flex items-center justify-center transition-all shadow-sm h-14 select-none ${
                  timeInBusiness === t
                    ? "border-[#0079C1] bg-blue-50 text-[#0079C1] ring-1 ring-[#0079C1]"
                    : "border-gray-300 bg-white hover:border-gray-400 text-gray-700"
                }`}
              >
                {t}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Kênh bán hàng hiện tại
            </h3>
            <div className="space-y-2.5">
              {[
                "Tại cửa hàng",
                "Shopee / Lazada / TiktokShop / Tiki / Sendo",
                "Facebook / Instagram / Tiktok",
                "Website",
              ].map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors select-none"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-[#0079C1] focus:ring-[#0079C1] cursor-pointer"
                    checked={channels.includes(c)}
                    onChange={() => toggleChannel(c)}
                  />
                  <span className="text-base font-medium text-gray-800 leading-normal">{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#0070f3] hover:bg-blue-600 text-white text-lg font-bold h-14 rounded transition-colors"
            >
              Tiếp tục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SignupStep4({ setView }: { setView: (v: ViewState) => void }) {
  const [trialData, setTrialData] = useState(true);

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    (window as any).__signupData = {
      ...(window as any).__signupData,
      trialData,
    };
    
    // Process registration
    const data = (window as any).__signupData;
    const phone = data.phone;
    const password = data.password;
    const name = data.name;

    // 1. Save new account to the global accounts registry
    let registryStr = localStorage.getItem("adminAccountsRegistry");
    let accounts: any[] = [];
    if (registryStr) {
      accounts = JSON.parse(registryStr);
    } else {
      // Initialize with default accounts
      accounts = [
        {
          username: "admin",
          password: "123",
          Quyen: "Admin",
          MaNV: "AD01",
          TenNV: "Trần Admin",
          storeOwner: "admin",
          TrangThai: "Hoạt động"
        },
        {
          username: "NV01",
          password: "123",
          Quyen: "Sales",
          MaNV: "NV01",
          TenNV: "Nguyễn Sales",
          storeOwner: "admin",
          TrangThai: "Hoạt động"
        },
        {
          username: "NV02",
          password: "123",
          Quyen: "Sales",
          MaNV: "NV02",
          TenNV: "Lê Hỗ Trợ",
          storeOwner: "admin",
          TrangThai: "Hoạt động"
        }
      ];
    }

    // New manager account
    const newAccount = {
      username: phone,
      password: password,
      Quyen: "Admin",
      MaNV: "AD01",
      TenNV: name,
      storeOwner: phone,
      TrangThai: "Hoạt động"
    };

    // Remove any previous record with the same username to avoid duplicate
    accounts = accounts.filter((a: any) => a.username !== phone);
    accounts.push(newAccount);
    localStorage.setItem("adminAccountsRegistry", JSON.stringify(accounts));

    // Also replicate new account inside default accounts list if admin needs it,
    // but keep credentials globally stored.
    let legacyData = JSON.parse(localStorage.getItem("adminAppData") || "null");
    if (legacyData && legacyData.TAIKHOAN) {
      legacyData.TAIKHOAN = legacyData.TAIKHOAN.filter((a: any) => a.username !== phone);
      legacyData.TAIKHOAN.push(newAccount);
      localStorage.setItem("adminAppData", JSON.stringify(legacyData));
    }

    // 2. Initialize the store-specific database for this user under `adminAppData_${phone}`
    let storeData: any = {
      TAIKHOAN: [
        newAccount
      ],
      KHACHHANG: [],
      SANPHAM: [],
      DONHANG: [],
      CTDH: []
    };

    if (data.trialData) {
      // Seed with some trial data custom for this user
      storeData.KHACHHANG = [
        {
          MaKH: "KH01",
          TenKH: "Khách hàng mua lẻ mẫu",
          SDT: "0912111222",
          DiaChi: "TP. Hồ Chí Minh",
          LoaiKH: "Cá nhân"
        },
        {
          MaKH: "KH02",
          TenKH: "Khách hàng VIP mẫu",
          SDT: "0938333444",
          DiaChi: "Hà Nội",
          LoaiKH: "Cá nhân Platinum"
        }
      ];

      storeData.SANPHAM = [
        {
          MaSP: "SP01",
          TenSP: `Sản Phẩm ${data.businessType} Mẫu A`,
          TenLoaiSP: data.businessType,
          DonGia: 120000,
          TonKho: 80
        },
        {
          MaSP: "SP02",
          TenSP: `Sản Phẩm ${data.businessType} Mẫu B`,
          TenLoaiSP: data.businessType,
          DonGia: 350000,
          TonKho: 14
        }
      ];

      storeData.DONHANG = [];
      storeData.CTDH = [];
    }

    localStorage.setItem(`adminAppData_${phone}`, JSON.stringify(storeData));
    setView("success");
  };

  return (
    <div className="w-full max-w-[600px] min-h-[450px] p-8 sm:p-12 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center relative animate-fade-in">
      <div className="w-full max-w-lg">
        {/* Progress header */}
        <div className="flex items-center justify-between mb-8 w-full">
          <button
            type="button"
            onClick={() => setView("signup_3")}
            className="flex items-center text-base font-semibold text-[#0079C1] hover:underline transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-0.5" /> Quay lại
          </button>
          <div className="flex items-center gap-3">
            <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden flex">
              <div className="bg-[#0070f3] w-full h-full rounded-full"></div>
            </div>
            <span className="text-base font-medium text-gray-500 whitespace-nowrap">
              3/3
            </span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900 leading-tight">
          Chọn phiên bản dùng thử
        </h2>

        <form onSubmit={handleFinish} className="space-y-4">
          <div className="space-y-3 mb-6">
            <div
              onClick={() => setTrialData(true)}
              className={`cursor-pointer rounded border p-4 text-center text-base font-semibold transition-all h-14 flex items-center justify-center select-none ${
                trialData
                  ? "border-[#0079C1] bg-blue-50 text-[#0079C1] ring-1 ring-[#0079C1]"
                  : "border-gray-300 hover:border-gray-400 text-gray-700 bg-white"
              }`}
            >
              Phiên bản có dữ liệu mẫu
            </div>
            <div
              onClick={() => setTrialData(false)}
              className={`cursor-pointer rounded border p-4 text-center text-base font-semibold transition-all h-14 flex items-center justify-center select-none ${
                !trialData
                  ? "border-[#0079C1] bg-blue-50 text-[#0079C1] ring-1 ring-[#0079C1]"
                  : "border-gray-300 hover:border-gray-400 text-gray-700 bg-white"
              }`}
            >
              Phiên bản không có dữ liệu mẫu
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#0070f3] hover:bg-blue-600 text-white text-lg font-bold h-14 rounded transition-colors"
            >
              Hoàn thành
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SuccessScreen({ setView }: { setView: (v: ViewState) => void }) {
  const data = (window as any).__signupData || {};

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-[600px] min-h-[450px] p-8 sm:p-12 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center relative animate-fade-in">
      <div className="w-full max-w-lg flex flex-col items-center">
        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 ring-4 ring-green-50 relative">
          <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 tracking-tight text-center leading-tight">
          Cửa hàng của bạn đã sẵn sàng
        </h2>

        <div className="w-full space-y-3 mb-8">
          <div className="bg-[#eff6ff] px-4 py-3 rounded border border-blue-100 flex justify-between items-center group">
            <div className="truncate pr-4">
              <div className="text-xs font-semibold text-gray-500 mb-0.5">
                Tên gian hàng
              </div>
              <div className="text-lg font-bold text-[#0070f3] truncate">
                {data.name || "MTP Shop"}
              </div>
            </div>
            <button type="button" onClick={() => handleCopy(data.name || "MTP Shop")} className="text-gray-400 hover:text-gray-600 p-2 shrink-0 bg-white rounded shadow-xs border border-blue-50/50">
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#f0fdf4] px-4 py-3 rounded border border-green-100 flex justify-between items-center group">
            <div className="truncate pr-4">
              <div className="text-xs font-semibold text-gray-500 mb-0.5">
                Tên đăng nhập
              </div>
              <div className="text-lg font-bold text-green-700 truncate">
                {data.phone || "0912345678"}
              </div>
            </div>
            <button type="button" onClick={() => handleCopy(data.phone || "")} className="text-gray-400 hover:text-gray-600 p-2 shrink-0 bg-white rounded shadow-xs border border-green-50/50">
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#fff7ed] px-4 py-3 rounded border border-orange-100 flex justify-between items-center group">
            <div className="truncate pr-4">
              <div className="text-xs font-semibold text-gray-500 mb-0.5">
                Mật khẩu
              </div>
              <div className="text-lg font-bold text-orange-600 truncate">
                {data.password || "********"}
              </div>
            </div>
            <button type="button" onClick={() => handleCopy(data.password || "")} className="text-gray-400 hover:text-gray-600 p-2 shrink-0 bg-white rounded shadow-xs border border-orange-50/50">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setView("login");
          }}
          className="w-full bg-[#0070f3] hover:bg-blue-600 text-white text-lg font-bold h-14 rounded transition-colors shadow-sm"
        >
          Bắt đầu quản lý
        </button>
      </div>
    </div>
  );
}

