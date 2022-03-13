import React, { useMemo, useState } from "react";
import { Radio, Row, Col, Slider, Select, Input } from "antd";
import { intersection } from "lodash";
import classic_spells from "./data/spells.json";
import ISpell from "./common/interfaces/ISpell";
import "./App.css";
import SpellsGrid from "./components/SpellsGrid/SpellsGrid";
import { capatalizeFirstLetter } from "./common/helpers/utils";

const spells = [...classic_spells];

const sortOptions = [
  {
    label: "Level",
    value: "level",
  },
  {
    label: "Name",
    value: "name",
  },
];
const nameDisplayOptions = [
  {
    label: "Cyrillic",
    value: "cyrillic",
  },
  {
    label: "Latin",
    value: "latin",
  },
];

const concentrationOptions = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Require",
    value: "require",
  },
  {
    label: "Does not require",
    value: "no-require",
  },
];

const levelMarks = {
  0: "Cantrips",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
};

const CLASS_LIST = Array.from(new Set(spells.map((spell) => spell.paramsData.classes).flat()))
  .map((item) => ({
    label: capatalizeFirstLetter(item),
    value: item,
  }))
  .sort((a) => (!!a.label.match(/TCoe/gim) ? 1 : -1));

const SCHOOLS_LIST = Array.from(new Set(spells.map((spell) => spell.paramsData.school))).map((item) => ({
  label: capatalizeFirstLetter(item),
  value: item,
}));

const SOURCES_LIST = Array.from(new Set(spells.map((spell) => spell.paramsData.source))).map((item) => ({
  label: capatalizeFirstLetter(item),
  value: item,
}));

function App() {
  const [displayName, setDisplayName] = useState<"cyrillic" | "latin">("cyrillic");
  const [sortType, setSortType] = useState<"name" | "level" | null>("name");
  const [levelRange, setLevelRange] = useState<[number, number]>([0, 10]);
  const [concentrationValue, setConcentrationValue] = useState<string>("");
  const [textSearchValue, setTextSearchValue] = useState<string>("");
  const [classesList, setClassesList] = useState<string[]>([]);
  const [schoolsList, setSchoolsList] = useState<string[]>([]);
  const [sourcesList, setSourcesList] = useState<string[]>([]);

  const listOfSpells = useMemo(() => {
    let spellList = [...spells];
    const abcSort = (a: ISpell, b: ISpell) => {
      if (displayName === "cyrillic") {
        return a.cyrillicName.charCodeAt(0) - +b.cyrillicName.charCodeAt(0);
      } else {
        return +a.latinName.charCodeAt(0) - +b.latinName.charCodeAt(0);
      }
    };
    const levelSort = (a: ISpell, b: ISpell) => +a.paramsData.level - +b.paramsData.level;

    spellList = spellList.filter((spell) => {
      const levelFilter = +spell.paramsData.level >= levelRange[0] && +spell.paramsData.level <= levelRange[1];
      const classesFilter = classesList.length === 0 || intersection(classesList, spell.paramsData.classes).length > 0;
      const schoolsFilter = schoolsList.length === 0 || schoolsList.includes(spell.paramsData.school);
      const sourcesFilter = sourcesList.length === 0 || sourcesList.includes(spell.paramsData.source);

      const textFilterReg = new RegExp(textSearchValue.toLocaleLowerCase(), "g");
      const textFilter =
          textSearchValue === "" ||
          !!spell.cyrillicName.toLocaleLowerCase().match(textFilterReg) ||
          !!spell.latinName.toLocaleLowerCase().match(textFilterReg);

      const hasConcentration = !!spell.paramsData.duration.match(/концентрация/gim);
      let concentrationFilter = true;
      if (concentrationValue === "require") concentrationFilter = hasConcentration;
      if (concentrationValue === "no-require") concentrationFilter = !hasConcentration;
      return (
        levelFilter &&
        classesFilter &&
        schoolsFilter &&
        sourcesList &&
        sourcesFilter &&
        concentrationFilter &&
        textFilter
      );
    });

    if (!sortType) return spellList;
    if (sortType === "level") {
      return spellList.sort(levelSort);
    } else {
      return spellList.sort(abcSort);
    }
  }, [sortType, displayName, levelRange, classesList, schoolsList, sourcesList, concentrationValue, textSearchValue]);

  return (
    <div className="App">
      <main>
        <div className="filters">
          <Row className="filters__row">
            <Col span={12}>
              <p className="filters__filter-title">Sort by: </p>
              <Radio.Group
                className="radio-group"
                name="radio-sort-by"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                optionType="default"
                options={sortOptions}
              />
            </Col>
            <Col span={12}>
              <p className="filters__filter-title">Name language: </p>
              <Radio.Group
                className="radio-group"
                name="radio-language"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                optionType="default"
                options={nameDisplayOptions}
              />
            </Col>
          </Row>
          <Row className="filters__row">
            <Col span={7}>
              <p className="filters__filter-title">Classes: </p>
              <Select
                mode="multiple"
                placeholder="Select classes"
                defaultValue={[]}
                options={CLASS_LIST}
                value={classesList}
                onChange={(list) => setClassesList(list)}
                style={{ width: "100%" }}
              />
            </Col>
            <Col offset={1} span={7}>
              <p className="filters__filter-title">Schools: </p>
              <Select
                mode="multiple"
                placeholder="Select classes"
                defaultValue={[]}
                options={SCHOOLS_LIST}
                value={schoolsList}
                onChange={(list) => setSchoolsList(list)}
                style={{ width: "100%" }}
              />
            </Col>
            <Col offset={1} span={7}>
              <p className="filters__filter-title">Sources: </p>
              <Select
                mode="multiple"
                placeholder="Sources"
                defaultValue={[]}
                options={SOURCES_LIST}
                value={sourcesList}
                onChange={(list) => setSourcesList(list)}
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
          <Row className="filters__row">
            <Col span={24}>
              <p className="filters__filter-title">Concentration: </p>
              <Radio.Group
                className="radio-group"
                value={concentrationValue}
                onChange={(e) => setConcentrationValue(e.target.value)}
                optionType="default"
                options={concentrationOptions}
              />
            </Col>
          </Row>
          <Row className="filters__row">
            <Col span={24}>
              <p className="filters__filter-title">Level: </p>
              <Slider
                marks={levelMarks}
                range
                dots
                onChange={(e) => setLevelRange(e)}
                value={levelRange}
                min={0}
                max={9}
              />
            </Col>
          </Row>
          <Row className="filters__row">
            <Col span={24}>
              <Input
                suffix={null}
                value={textSearchValue}
                onChange={(e) => setTextSearchValue(e.target.value)}
                placeholder="input search text"
              />
            </Col>
          </Row>
        </div>
        <Row className="spell-list-container">
          <div className="spells-counter">{listOfSpells.length} spells</div>
          <SpellsGrid
            displayName={displayName}
            listOfSpells={listOfSpells}
          />
        </Row>
      </main>
    </div>
  );
}

export default App;
