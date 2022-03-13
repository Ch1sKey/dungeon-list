import { useEffect, useState } from "react";
import './style.css'
import { FixedSizeGrid as Grid } from "react-window";
import ISpell from "../../common/interfaces/ISpell";
import SpellCardItem from "../SpellCard/SpellCardItem";import { clamp } from "../../common/helpers/utils";

interface SpellsGridProps {
    displayName: "latin" | "cyrillic",
    listOfSpells: ISpell[]
}
const SpellsGrid = ({ displayName, listOfSpells }: SpellsGridProps) => {
    const COLUMN_WIDTH = 360;
    const [currentWindowWidth, setCurrentWindowWidth] = useState<number>(window.innerWidth);
    const updateWidth = () => {
        setCurrentWindowWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', updateWidth);
        updateWidth();
        return () => window.removeEventListener('resize', updateWidth);
    }, [])


    return <Grid
        className="spells-list"
        columnCount={currentWindowWidth / COLUMN_WIDTH}
        columnWidth={COLUMN_WIDTH}
        height={600}
        itemData={listOfSpells}
        rowCount={clamp(Math.ceil(listOfSpells.length / 4), 1, 500)}
        rowHeight={40}
        width={currentWindowWidth}
  >
    {({ ...props }) => <SpellCardItem {...props} displayName={displayName} />}
  </Grid>
}

export default SpellsGrid