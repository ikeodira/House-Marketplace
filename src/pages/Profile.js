import { useState, useEffect } from "react";
import {getAuth, updateProfile} from "firebase/auth"
import {updateDoc, doc, collection, getDocs, query,where, orderBy, deleteDoc } from 'firebase/firestore'
import {db} from "../firebase.config"
import { useNavigate, Link } from "react-router-dom";
import {toast} from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import ListingItem from "../components/ListingItem";



function Profile(){
    const auth = getAuth()
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);

    const [changeDetails, setChangeDetails] = useState(false);

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email:auth.currentUser.email
    })

    const {name, email} = formData;

    const navigate = useNavigate();

    useEffect(()=>{
        const fetchUserListings = async () =>  {
            const listingRef = collection(db, 'listing')

            const q = query(
                listingRef,
                where('userRef', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc')
            )

            const querySnap = await getDocs(q);

            let listings = []

            querySnap.forEach((doc) =>{
                return listings.push({
                    id:doc.id,
                    data:doc.data()
                })
            })

            setListings(listings);
            setLoading(false);

        }           
        fetchUserListings()
    },[auth.currentUser.uid])

    const onLogout = ()=>{
        auth.signOut()
        navigate("/");
    }

    const onSubmit = async() =>{
        try{
            if(auth.currentUser.displayName !== name){
                // Update display name in fb
                await updateProfile(auth.currentUser, {
                    displayName:name                    
                })

                // Update in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name:name
                })
                toast.success("profile update successfull")
            }
        }catch(error){
            toast.error("Could not update profile details");
        }

    }

    const onChange = (e) =>{
        setFormData((prevState) =>({
            ...prevState,
            [e.target.id]:e.target.value,
        }))
    }
    
    return(
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button type="button" className="logOut" onClick={onLogout}>Logout</button>
            </header>

           <main>
                <div className="profileDetailsHeader">
                    <div className="profileDetailsText">Personal Details</div>
                    <p className="changePersonalDetails" onClick={()=>{
                        changeDetails && onSubmit()
                        setChangeDetails((prevState)=>!prevState);
                    }}>
                        {changeDetails ? 'done' :'change'}
                    </p>
                </div>

                <div className="profileCard">
                    <form>
                        <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange}/>
                        <input type="email" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} value={email} onChange={onChange}/>                        
                    </form>
                </div>

                <Link to="/create-listing" className="createListing">
                    <img src={homeIcon} alt="home" />
                    <p>Sell or rent your home</p>
                    <img src={arrowRight} alt="arrow right"/>
                </Link>

                {!loading && listings.length > 0 && (
                    <>
                        <p className="listingText">Your Listings</p>
                        <ul className="listingsList">
                            {listings.map((listing)=>{
                                return (
                                    <ListingItem key={listing.id} listing={listing} id={listing.id}/>
                                )                                
                            })}
                        </ul>
                    </>
                )}

           </main>
        </div>
    )
}

export default Profile;