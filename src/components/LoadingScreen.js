export function LoadingScreen(){
    return(
        <div className="loading-screen">
            <div className="lds-dual-ring"/>
            <p>Loading the pose estimation model... In the meantime, please enable your camera!</p>
        </div>
    )
}