import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, Group, Transformer } from 'react-konva';
import { GET, POST, PUT, DELETE } from "../../appConfig/Endpoint";
import TableAssignmentModal from "./TableAssignmentModal";
import './room-layout.scss';
import Button from "../../components/elements/common/button/Button";

const RoomLayout = () => {
    // States
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [tables, setTables] = useState([]);
    const [selectedId, selectShape] = useState(null);
    const [mode, setMode] = useState('select'); // select, hand, draw_poly, draw_rect
    const [newPoints, setNewPoints] = useState([]);
    const [scale, setScale] = useState(1);
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
    const [selectedTableForGuests, setSelectedTableForGuests] = useState(null);

    const stageRef = useRef(null);
    const trRef = useRef(null);

    // Initial Data
    useEffect(() => {
        GET('/rooms', null, {}, data => {
            setRooms(data);
            if (data.length > 0) setSelectedRoom(data[0]);
        });
    }, []);

    useEffect(() => {
        if (selectedRoom) GET(`/rooms/${selectedRoom.id}/tables`, null, {}, setTables);
    }, [selectedRoom]);

    // Transformer logic
    useEffect(() => {
        if (selectedId) {
            const node = stageRef.current.findOne('#' + selectedId);
            if (node) {
                trRef.current.nodes([node]);
                trRef.current.getLayer().batchDraw();
            }
        }
    }, [selectedId]);

    const handleStageClick = (e) => {
        // Deselect when clicking on empty area
        if (e.target === e.target.getStage()) {
            selectShape(null);
            if (mode === 'draw_poly') {
                const pos = stageRef.current.getPointerPosition();
                const transform = stageRef.current.getAbsoluteTransform().copy().invert();
                const realPos = transform.point(pos);
                setNewPoints([...newPoints, realPos.x, realPos.y]);
            }
            return;
        }

        // Select table
        const clickedOnTable = e.target.getParent()?.attrs?.name === 'table-group';
        if (clickedOnTable) {
            selectShape(e.target.getParent().attrs.id);
        }
    };

    const addTable = (shape) => {
        if (!selectedRoom) return;
        const newTable = {
            name: `Stół ${tables.length + 1}`,
            shape: shape,
            width: shape === 'ROUND' ? 80 : 120,
            height: 80,
            posX: 400,
            posY: 300,
            rotation: 0,
            capacity: 6
        };
        POST(`/rooms/${selectedRoom.id}/tables`, newTable, data => {
            setTables([...tables, data]);
            selectShape(data.id);
        });
    };

    const handleTransformEnd = (e) => {
        const node = e.target;
        const id = node.id();
        const table = tables.find(t => t.id === id);

        const updatedTable = {
            ...table,
            posX: node.x(),
            posY: node.y(),
            rotation: node.rotation(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY()
        };

        // Reset scale to 1 and apply to width/height for technical precision
        node.scaleX(1);
        node.scaleY(1);

        PUT('/rooms/tables', id, updatedTable);
    };

    const saveRoom = () => {
        const name = prompt("Nazwa sali:");
        if (!name || newPoints.length < 6) return;
        const perimeter = [];
        for (let i = 0; i < newPoints.length; i += 2) perimeter.push({ x: newPoints[i], y: newPoints[i+1] });
        POST('/rooms', { name, perimeter: JSON.stringify(perimeter) }, (data) => {
            setRooms([...rooms, data]);
            setSelectedRoom(data);
            setMode('select');
            setNewPoints([]);
        });
    };

    const selectedTableData = tables.find(t => t.id === selectedId);

    return (
        <div className="figma-planner">
            {/* Top Bar - Room Selector */}
            <div className="planner-topbar">
                <div className="logo">PLANNER 2.0</div>
                <select className="room-dropdown" value={selectedRoom?.id || ''} onChange={e => setSelectedRoom(rooms.find(r => r.id === e.target.value))}>
                    <option value="">Wybierz projekt...</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <div className="view-info">Skala: {Math.round(scale * 100)}%</div>
            </div>

            <div className="planner-main">
                {/* Left Toolbar (Figma Style) */}
                <div className="figma-toolbar">
                    <button className={`tool ${mode === 'select' ? 'active' : ''}`} onClick={() => setMode('select')} title="Wskaźnik (V)">
                        <span className="icon">➚</span>
                    </button>
                    <button className={`tool ${mode === 'hand' ? 'active' : ''}`} onClick={() => setMode('hand')} title="Rączka (H)">
                        <span className="icon">✋</span>
                    </button>
                    <div className="divider" />
                    <button className={`tool ${mode === 'draw_poly' ? 'active' : ''}`} onClick={() => {setMode('draw_poly'); setNewPoints([]);}} title="Rysuj Salę (P)">
                        <span className="icon">🖋️</span>
                    </button>
                    <div className="divider" />
                    <button className="tool" onClick={() => addTable('RECTANGLE')} title="Dodaj Prostokąt">
                        <span className="icon">▭</span>
                    </button>
                    <button className="tool" onClick={() => addTable('ROUND')} title="Dodaj Koło">
                        <span className="icon">◯</span>
                    </button>
                    {mode === 'draw_poly' && <button className="tool save-btn" onClick={saveRoom}>Zapisz</button>}
                </div>

                {/* Canvas Area */}
                <div className="canvas-area">
                    <Stage
                        width={window.innerWidth - 460}
                        height={window.innerHeight - 120}
                        ref={stageRef}
                        scaleX={scale} scaleY={scale}
                        x={stagePos.x} y={stagePos.y}
                        draggable={mode === 'hand'}
                        onClick={handleStageClick}
                        onWheel={(e) => {
                            e.evt.preventDefault();
                            const newScale = e.evt.deltaY < 0 ? scale * 1.1 : scale / 1.1;
                            setScale(newScale);
                        }}
                    >
                        <Layer>
                            {/* Grid Lines */}
                            {[...Array(50)].map((_, i) => (
                                <React.Fragment key={i}>
                                    <Line points={[i * 100, 0, i * 100, 2000]} stroke="#f0f0f0" strokeWidth={1} />
                                    <Line points={[0, i * 100, 2000, i * 100]} stroke="#f0f0f0" strokeWidth={1} />
                                </React.Fragment>
                            ))}

                            {/* Room Perimeter */}
                            {selectedRoom && selectedRoom.perimeter && (
                                <Line
                                    points={JSON.parse(selectedRoom.perimeter).flatMap(p => [p.x, p.y])}
                                    closed={true} stroke="#2c3e50" strokeWidth={3} fill="#fff"
                                />
                            )}

                            {/* Drawing Preview */}
                            <Line points={newPoints} stroke="#d4af37" strokeWidth={2} dash={[5, 5]} />

                            {/* Tables */}
                            {tables.map(table => (
                                <Group
                                    key={table.id} id={table.id} name="table-group"
                                    x={table.posX} y={table.posY} rotation={table.rotation}
                                    draggable={mode === 'select'}
                                    onDragEnd={handleTransformEnd}
                                    onTransformEnd={handleTransformEnd}
                                    onDblClick={() => setSelectedTableForGuests(table)}
                                >
                                    {table.shape === 'ROUND' ? (
                                        <Circle radius={table.width/2} fill="#d4af37" stroke="#2c3e50" strokeWidth={0.5} />
                                    ) : (
                                        <Rect width={table.width} height={table.height} offsetX={table.width/2} offsetY={table.height/2} fill="#d4af37" stroke="#2c3e50" strokeWidth={0.5} />
                                    )}
                                    <Text text={table.name} fontSize={10} width={table.width} align="center" x={-table.width/2} y={-5} fill="#fff" />
                                </Group>
                            ))}
                            <Transformer ref={trRef} boundBoxFunc={(oldBox, newBox) => newBox.width < 20 ? oldBox : newBox} />
                        </Layer>
                    </Stage>
                </div>

                {/* Right Panel - Properties (Figma Style) */}
                <div className="figma-properties">
                    {selectedTableData ? (
                        <>
                            <div className="prop-header">Właściwości Obiektu</div>
                            <div className="prop-group">
                                <label>Nazwa Stołu</label>
                                <input type="text" value={selectedTableData.name} onChange={(e) => {
                                    const updated = {...selectedTableData, name: e.target.value};
                                    setTables(tables.map(t => t.id === selectedId ? updated : t));
                                }} onBlur={() => PUT('/rooms/tables', selectedId, selectedTableData)} />
                            </div>
                            <div className="prop-row">
                                <div className="prop-item">
                                    <label>X</label>
                                    <input type="number" value={Math.round(selectedTableData.posX)} readOnly />
                                </div>
                                <div className="prop-item">
                                    <label>Y</label>
                                    <input type="number" value={Math.round(selectedTableData.posY)} readOnly />
                                </div>
                            </div>
                            <div className="prop-row">
                                <div className="prop-item">
                                    <label>Szerokość</label>
                                    <input type="number" value={Math.round(selectedTableData.width)} readOnly />
                                </div>
                                <div className="prop-item">
                                    <label>Rotacja</label>
                                    <input type="number" value={Math.round(selectedTableData.rotation)} readOnly />
                                </div>
                            </div>
                            <div className="prop-group">
                                <label>Liczba Miejsc</label>
                                <input type="number" value={selectedTableData.capacity} onChange={(e) => {
                                    const updated = {...selectedTableData, capacity: parseInt(e.target.value)};
                                    setTables(tables.map(t => t.id === selectedId ? updated : t));
                                }} onBlur={() => PUT('/rooms/tables', selectedId, selectedTableData)} />
                            </div>
                            <Button onClick={() => setSelectedTableForGuests(selectedTableData)} className="add" style={{width: '100%', marginTop: '20px'}}>Usadź Gości</Button>
                            <Button onClick={() => {
                                if(window.confirm("Usunąć stół?")) DELETE('/rooms/tables', selectedId, () => {
                                    setTables(tables.filter(t => t.id !== selectedId));
                                    selectShape(null);
                                });
                            }} className="delete" style={{width: '100%', marginTop: '10px'}}>Usuń Stół</Button>
                        </>
                    ) : (
                        <div className="no-selection">Wybierz obiekt na planie, aby edytować jego właściwości.</div>
                    )}
                </div>
            </div>

            {selectedTableForGuests && (
                <TableAssignmentModal table={selectedTableForGuests} onClose={() => setSelectedTableForGuests(null)} />
            )}
        </div>
    );
};

export default RoomLayout;