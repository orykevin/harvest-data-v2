import { useState, createContext } from "react";
import "./style/App.css";
import TableView from "./components/TableView";
import MenuBar from "./components/MenuBar";
import ipContext from "./function/ipContext";
import { ipContextInterface } from "./function/ipContext";
import SettingDialog from "./components/SettingDialog";
import Inputbar from "./components/InputBar/Inputbar";
import { Input } from "./components/ui/input";
import Inputview from "./components/InputView/Inputview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table2, Upload } from "lucide-react";
export interface PropertyInterface {
  date: Date | null;
  from: Date | null;
  to : Date | null;
  code: string | null;
  name: string | null;
  unknown: boolean;
  types: string[];
}

function App() {
  const hostname = window.location.hostname
  const [property, setProperty] = useState<PropertyInterface | null>(null);
  const [ipConfig, setIpConfig] = useState<string>(hostname);
  const [view, setView] = useState<string>("table");
  const [tableView,setTableView] = useState<string>("day")
  const [inputMode,setInputMode] = useState<string>("img")
  const value = { ipConfig, setIpConfig };
  const tableTabsHandler = (tab:string) => {
    setTableView(tab)
    setProperty(null)
  }

  const viewTabsHandler = (tab:string) => {
    setView(tab)
  }

  return (
    <ipContext.Provider value={value}>
      <div className="grid grid-cols-12">
        <div className="menu-bar col-span-3 grid grid-cols-12">
          <div className="flex flex-col col-span-2 bg-gray-100 p-0 items-center gap-6 pt-5 border-r border-gray-300">
            <Table2 color="black" className={`p-1 w-8 h-8 rounded-md cursor-pointer hover:bg-gray-200 ${view === 'table' && 'bg-gray-200'}`} onClick={()=>viewTabsHandler('table')} />
            <Upload color="black" className={`p-1 w-8 h-8 rounded-md cursor-pointer hover:bg-gray-200 ${view === 'input' && 'bg-gray-200'}`} onClick={()=>viewTabsHandler('input')} />
            <SettingDialog />
          </div>
          <div className="col-span-10 p-4">
            <h1 className="menu-title">Harvest Data</h1>
            
            {view === 'table' ? 
              <Tabs defaultValue="day" className="w-[100%] mt-4" value={tableView}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="day" onClick={() => tableTabsHandler("day")}>
                    Day View
                  </TabsTrigger>
                  <TabsTrigger value="client" onClick={() => tableTabsHandler('client')}>
                    Client View
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="day">
                  <MenuBar property={property} setProperty={setProperty} view={tableView} />
                </TabsContent>
                <TabsContent value="client">
                  <MenuBar property={property} setProperty={setProperty} view={tableView} />
                </TabsContent>
              </Tabs> 
              :
              <Inputbar inputMode={inputMode} setInputMode={setInputMode} />  
            }
            
          </div>
        </div>
        <div className="table-container col-span-9">
          {view === "table" ? (
            tableView === 'day' ? <TableView property={property} setProperty={setProperty} view={tableView} />
            : tableView === 'client' && <TableView property={property} setProperty={setProperty} view={tableView}  />
          ) : (
            <Inputview inputMode={inputMode} setInputMode={setInputMode} />
          )}
        </div>
      </div>
    </ipContext.Provider>
  );
}

export default App;
