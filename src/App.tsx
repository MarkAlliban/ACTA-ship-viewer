import {Route,createBrowserRouter,createRoutesFromElements,RouterProvider} from "react-router-dom";
import {ShipViewerLayout} from './utils/context';
import {FrontPage} from './pages/frontpage';
import {ErrorRouter} from './utils/error-router';
import {ShowList} from './pages/showlist';
import {ShowShipMultiple} from './pages/showship';
import {ShowFleet} from './pages/showfleet';

const router=createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path={'/'} index element={<FrontPage />} />
			<Route element={<ShipViewerLayout />} errorElement={<ErrorRouter />}>
				<Route path='/list' element={<ShowList />} />
				<Route path='/ship' element={<ShowShipMultiple />} />
				<Route path='/fleet' element={<ShowFleet />} />
			</Route>
		</>
	)
);

export default function App() {
	return (
		<div className="App">
			<RouterProvider router={router} />
		</div>
	)
}
