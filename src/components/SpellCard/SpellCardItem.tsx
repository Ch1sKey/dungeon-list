import "./style.css";
import React from "react";
import { Tooltip } from "antd";
import ISpell from "../../common/interfaces/ISpell";
import { ReactComponent as ConcentraionIcon } from "../../assets/concentration.svg";

//School icons
import abjuration from "../../assets/schools/abjuration.png";
import conjuration from "../../assets/schools/conjuration.png";
import divination from "../../assets/schools/divination.png";
import enchantment from "../../assets/schools/enchantment.png";
import evocation from "../../assets/schools/evocation.png";
import necromancy from "../../assets/schools/necromancy.png";
import transmutation from "../../assets/schools/transmutation.png";
import illusion from "../../assets/schools/illusion.png";
import { capatalizeFirstLetter } from "../../common/helpers/utils";

interface SpellCardProps {
  data: ISpell[];
  columnIndex: number;
  rowIndex: number;
  displayName: "latin" | "cyrillic";
}

const getSchoolIcon = (schoolName: string) => {
  return (
    {
      воплощение: evocation,
      ограждение: abjuration,
      прорицание: divination,
      вызов: conjuration,
      преобразование: transmutation,
      иллюзия: illusion,
      очарование: enchantment,
      некромантия: necromancy,
    }[schoolName] || ""
  );
};

const SpellCardItem = ({ data, rowIndex, columnIndex, displayName, ...rest }: SpellCardProps) => {
  const spell = data?.[rowIndex * 4 + columnIndex];
  const getSpellNameToDisplay = (spell: ISpell) =>
    (displayName === "latin" ? spell.latinName : spell.cyrillicName) ?? spell.title;
  const getSpellNameToTooltip = (spell: ISpell) => 
  (displayName === "latin" ? spell.cyrillicName : spell.latinName) ?? spell.title;
  const isRequireContentration = !!spell?.paramsData.duration.match(/концентрация/gim);
  if(!spell) return null;
  return (
    <li {...rest} className="spell-item" key={spell.id}>
      <a className="spell-item__link" href={spell.paramsData.originLink} target="_blank" rel="noreferrer">
        <div className="spell-item__level">{spell.paramsData.level}</div>
        <div className="spell-item__school">
          <Tooltip title={capatalizeFirstLetter(spell.paramsData.school)}>
            <img
              className="spell-item__school__image"
              alt={spell.paramsData.school}
              src={getSchoolIcon(spell.paramsData.school)}
            />
          </Tooltip>
        </div>
        <Tooltip title={getSpellNameToTooltip(spell)}>
          <div>{getSpellNameToDisplay(spell)}</div>
        </Tooltip>
        {isRequireContentration ? (
          <Tooltip title="Concentration">
            <div className="spell-item__concentraion-icon">
              <ConcentraionIcon />
            </div>
          </Tooltip>
        ) : null}
      </a>
    </li>
  );
};

export default SpellCardItem;
