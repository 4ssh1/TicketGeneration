import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import Card from '../Components/Card'
import { useNavigate } from 'react-router-dom'

function FormPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        feedback: '',
        image: ''
    })
    const [errorMessage, setErrorMessage] = useState({})
    const [loading, setLoading] = useState(false)
    const [cloudImage, setCloudImage] = useState('')
    const navigate = useNavigate()
    const [ticket, setTicket] = useState()

    useEffect(() => {
        const ticketdetail = JSON.parse(localStorage.getItem("sTicket"))
        if(!ticketdetail) {
            return navigate("/")
        }
        setTicket(ticketdetail)
        setFormData({name:ticketdetail?.name, email:ticketdetail?.email, feedback:ticketdetail?.feedback, image: ticketdetail?.image});
    }, []);


    useEffect(() => {
        if (formData.name || formData.email || formData.feedback || formData.image) {
            setTicket({...ticket, ...formData})
            localStorage.setItem("sTicket", JSON.stringify({...ticket, ...formData}));
        }
    }, [formData]);



    function handleOption2(e) {
        handleSubmit(e)
    }
    function handleOption1() {
        navigate("/")
    }

    function handleSubmit(e) {
        e.preventDefault();
        
        let error = {};
        
        if (!formData.name?.trim()) {
            error.name = "Name is required";
        }
        
        if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            error.email = "Enter a valid email";
        }
        
        if (!formData.feedback?.trim()) {
            error.feedback = "Description is required";
        }
    
        if (!formData.image) {
            error.image = "No image uploaded";
        }
    
        setErrorMessage(error);
    
        if (Object.keys(error).length === 0) {
            let allTicket = JSON.parse(localStorage.getItem("allTicket")) ?? []
            allTicket = [...allTicket, ticket]
            localStorage.removeItem("sTicket")
            localStorage.setItem("allTicket", JSON.stringify(allTicket))
            console.log(ticket, allTicket)
            navigate('/lastPage');
        }
    }
    

    function handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    async function handleFileUpload(e) {
        const file = e.target.files[0]
        if (!file) return

        setLoading(true)
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', `${import.meta.env.VITE_UPLOAD_PRESET}`)
        data.append('cloud_name', `${import.meta.env.VITE_CLOUDINARY_NAME}`)

        const result = await fetch(`${import.meta.env.VITE_CLOUDINARY_URL}`, {
            method: "POST",
            body: data
        })
        const uploadedUrl = await result.json()

        setCloudImage(uploadedUrl.url)
        setFormData((prev) => ({ ...prev, image: uploadedUrl.url }))
        setLoading(false)
    }

    const mybuttons = [
        {
          title : "Back", 
          handle : handleOption1
        }, 
        {
          title: `Get ${ticket?.price ?? ''} ticket`, 
          handle : handleOption2
        }
      ]


    return (
        <div className='bg h-screen md:min-h-[140vh]'>
            <div>
                <Navbar />
            </div>
            <div className='pt-11'>
                <Card number={2} cardIntro={"Attendee Details"} buttons={mybuttons}>
                    <form onSubmit={handleSubmit} onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}>
                        <div>
                            <p className='py-2'>Upload Profile Photo</p>
                            <div className='backdrop-brightness-50 mx-3 h-28 flex justify-center  '>
                                <div className=' bg-teal-700 w-1/2 pl-4 md:pl-0 pt-2 z-10 shadow-cyan-900 shadow-2xl rounded-3xl 
                                flex flex-col justify-center items-center relative'>
                                            {!formData.image ? (
                                                <>
                                                    <img src="icon.png" alt="uploadIcon" className="h-8 w-10" />
                                                    {loading ? <span>Loading...</span> :<label htmlFor="file">Drag and Drop or click to upload</label>}
                                                    <span className='sr-only' id='image-hint'>Drag and Drop or click to upload, it is required</span>
                                                    <input
                                                        type="file"
                                                        name="file"
                                                        id='file'
                                                        aria-describedby='image-hint'
                                                        className="absolute inset-0 w-full h-full opacity-0  cursor-pointer"
                                                        onChange={handleFileUpload}
                                                    />
                                                </>
                                            ) : (
                                                <div className="absolute inset-0 w-full h-full">
                                                    <img
                                                        src={formData.image ?? ""}
                                                        alt="uploaded_image"
                                                        className="object-cover w-full h-full rounded-3xl hover:opacity-50"
                                                    />
                                                    <div className=' opacity-0 hover:opacity-50 absolute w-full h-full top-0 flex flex-col justify-center items-center bg-teal-600 rounded-3xl'>
                                                    <img src="icon.png" alt="uploadIcon" className="h-8 w-10" />
                                                    {loading ? <span>Loading...</span> :<label htmlFor="file">Drag and Drop or click to upload</label>}
                                                        <span className='sr-only' id='image-hint'>Drag and Drop or click to upload, it is required</span>
                                                        <input
                                                            type="file"
                                                            name="file"
                                                            id='file'
                                                            aria-describedby='image-hint'
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            onChange={handleFileUpload}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                     {errorMessage && <span className='red'>{errorMessage.image}</span>}
                                </div>
                            </div>
                            <div className='sm:leading-6 flex flex-col items-start text-start px-3  '>
                                <div className='w-full py-3 '>
                                    <label htmlFor="name">Enter your name</label>
                                    <div><input type="text" name="name" id='name' className='w-full rounded-lg px-4'
                                        value={formData?.name ?? ""} onChange={handleChange} autoComplete='false' aria-describedby='name-error' />
                                        <span id='name-error' className='sr-only' role='alert'>Name is required</span>
                                        {errorMessage && <span className='red'>{errorMessage.name}</span>}
                                    </div>
                                </div>
                                <div className='w-full py-3' >
                                    <label htmlFor="email" >Enter your email</label>
                                    <div><input type="email" name="email" id='email' className='w-full rounded-lg px-4'
                                        placeholder='✉️ hello@avioflagos.io' autoComplete='false' aria-describedby='email-hint'
                                        value={formData?.email ?? ""} onChange={handleChange} />
                                        <span className='sr-only' id='email-hint'>Example: name@example.com</span>
                                        {errorMessage && <span className='red'>{errorMessage.email}</span>}
                                    </div>
                                </div>
                                <div className='w-full py-3 '>
                                    <p>About the Project</p>
                                    <div><textarea name="feedback" cols="30" rows="3" placeholder='Text-area'
                                        className='w-full rounded-lg px-4' aria-describedby='feedback-hint'
                                        value={formData?.feedback ?? ""} onChange={handleChange}
                                    ></textarea></div>
                                    <span className="sr-only" id='feedback-hint'>This field is required</span>
                                    {errorMessage && <span className='red'>{errorMessage.feedback}</span>}
                                </div>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default FormPage
