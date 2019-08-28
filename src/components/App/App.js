import React from 'react';
import { fetchData, margins } from '../../utils/utils';
import Svg from '../Svg/Svg';
import { Loading, FullScreenLoader } from '../Loading/Loading';
import ButtonsPanel from '../ButtonsPanel/ButtonsPanel';
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.root = React.createRef();
        this.state = {
            width: 0,
            height: 0,
            initialZoom: 0.7,
            centerX: null,
            data: null,
            isLoading: true,
            isFetchingMoreNodes: false,
        };
    }

    componentDidMount() {
        this.setInitialDimensions();
        this.fetchRootNodes();
    }

    setInitialDimensions() {
        if (this.root.current) {
            const width = this.root.current.offsetWidth - margins.left - margins.right;
            const height = this.root.current.offsetHeight - margins.bottom - margins.top;
            this.setState({
                width,
                height,
                centerX: width / 2,
            });
        }
    }

    getNodeChildren = async (node) => {
        const nodeId = node.data.id;
        this.setState({ isFetchingMoreNodes: true });
        const children = await fetchData('https://2jdg5klzl0.execute-api.us-west-1.amazonaws.com/default/EmployeesChart-Api?'
            + `manager=${nodeId}`);
        this.setState({ isFetchingMoreNodes: false });
        return children;
    };

    handleZoomIn = () => {
        const { initialZoom } = this.state;
        this.setState({
            initialZoom: initialZoom + 0.1,
        });
    };

    handleZoomOut = () => {
        const { initialZoom } = this.state;
        this.setState({
            initialZoom: initialZoom - 0.1,
        });
    };

    async fetchRootNodes() {
        const root = await fetchData('https://2jdg5klzl0.execute-api.us-west-1.amazonaws.com/default/EmployeesChart-Api?'
        + 'manager=0');
        if (root[0]) {
            const children = await fetchData('https://2jdg5klzl0.execute-api.us-west-1.amazonaws.com/default/EmployeesChart-Api?'
            + `manager=${root[0].id}`);
            this.setState({
                data: [...root, ...children],
                isLoading: false,
            });
        }
    }

    render() {
        const { isLoading, width, height, centerX, isFetchingMoreNodes, data, initialZoom } = this.state;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <div ref={this.root} className="app">
                            {!isLoading && <ButtonsPanel onZoomOut={this.handleZoomOut} onZoomIn={this.handleZoomIn} />}
                            {
                                isLoading
                                    ? <Loading />
                                    : (
                                        <Svg
                                            width={width}
                                            height={height}
                                            centerX={centerX}
                                            data={data}
                                            onGetChildrenNode={this.getNodeChildren}
                                            initialZoom={initialZoom}
                                        />
                                    )
                            }
                            {isFetchingMoreNodes && <FullScreenLoader />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
