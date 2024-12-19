

import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";





function Login() {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const login = async () => {
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login successful", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            localStorage.setItem("user", JSON.stringify({ uid: result.user.uid, email: result.user.email }));
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error("Login failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = {
                name: result.user.displayName,
                uid: result.user.uid,
                email: result.user.email,
                time: Timestamp.now(),
            };
            const userRef = collection(fireDB, "users");
            await addDoc(userRef, user);
            toast.success("Logged in with Google Successfully");
            localStorage.setItem("user", JSON.stringify({ uid: user.uid, email: user.email }));
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error("Failed to login with Google: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            {loading && <Loader />}
            <div className="bg-gray-800 px-10 py-10 rounded-xl">
                <div>
                    <h1 className="text-center text-white text-xl mb-4 font-bold">Login</h1>
                </div>
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
                        placeholder="Email"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-600 mb-4 px-2 py-2 w-full lg:w-[20em] rounded-lg text-white placeholder:text-gray-200 outline-none"
                        placeholder="Password"
                    />
                </div>
                <div className="flex justify-center mb-3">
                    <button
                        onClick={login}
                        className="bg-yellow-500 w-full text-black font-bold px-2 py-2 rounded-lg"
                    >
                        Login
                    </button>
                </div>
                <div className="flex justify-center mb-3">
                    <button
                        onClick={loginWithGoogle}
                        className="bg-blue-500 w-full p-2 mt-5 text-white font-bold px-2 py-2 rounded-lg"
                    >
                        Login with Google
                    </button>
                </div>
                <div>
                    <h2 className="text-white">
                        Don't have an account?{" "}
                        <Link className="text-yellow-500 font-bold" to={"/signup"}>
                            Signup
                        </Link>
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default Login;
