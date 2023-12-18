export class TCM {
  private Types: any[];
  private Categories: any[];
  private Mechanics: any[];

  private TypesMap: { [key: string]: number };
  private TypesTotal: number;

  private CategoriesMap: { [key: string]: number };
  private CategoriesTotal: number;

  private MechanicsMap: { [key: string]: number };
  private MechanicsTotal: number;

  private typesPrecent: { [key: string]: number } | null;
  private categoriesPrecent: { [key: string]: number } | null;
  private mechanicsPrecent: { [key: string]: number } | null;

  constructor(Types: any[], Categories: any[], Mechanics: any[]) {
      this.Types = Types;
      this.Categories = Categories;
      this.Mechanics = Mechanics;

      this.TypesMap = {};
      this.TypesTotal = 0;

      this.CategoriesMap = {};
      this.CategoriesTotal = 0;

      this.MechanicsMap = {};
      this.MechanicsTotal = 0;

      this.typesPrecent = null;
      this.categoriesPrecent = null;
      this.mechanicsPrecent = null;

      for (let i = 0; i < Types.length; i++) {
          this.TypesMap[Types[i]["name"]] = 0;
      }

      for (let i = 0; i < Categories.length; i++) {
          this.CategoriesMap[Categories[i]["name"]] = 0;
      }

      for (let i = 0; i < Mechanics.length; i++) {
          this.MechanicsMap[Mechanics[i]["name"]] = 0;
      }
  }

  public addTypeList(Types: string[], rating: number): void {
      for (let i = 0; i < Types.length; i++) {
          this.TypesMap[Types[i]] += (rating - 5);
          this.TypesTotal += 1;
      }
  }

  public addCategoryList(Categories: string[], rating: number): void {
      for (let i = 0; i < Categories.length; i++) {
          this.CategoriesMap[Categories[i]] += (rating - 5);
          this.CategoriesTotal += 1;
      }
  }

  public addMechanicList(Mechanics: string[], rating: number): void {
      for (let i = 0; i < Mechanics.length; i++) {
          this.MechanicsMap[Mechanics[i]] += (rating - 5);
          this.MechanicsTotal += 1;
      }
  }

  private calcOccurences(TargetMap: { [key: string]: number }, TargetTotal: number): { [key: string]: number } {
      if (TargetTotal === 0) {
          return {};
      }

      const occurences: { [key: string]: number } = {};
      for (const key in TargetMap) {
          occurences[key] = TargetMap[key] / TargetTotal;
      }

      return occurences;
  }

  public calcStatistic(): { [key: string]: number }[] {
      this.typesPrecent = this.calcOccurences(this.TypesMap, this.TypesTotal);
      this.categoriesPrecent = this.calcOccurences(this.CategoriesMap, this.CategoriesTotal);
      this.mechanicsPrecent = this.calcOccurences(this.MechanicsMap, this.MechanicsTotal);

      return [this.typesPrecent, this.categoriesPrecent, this.mechanicsPrecent];
  }

  public toString(): string {
      console.log("Types", this.Types, "\n");
      console.log("Categories", this.Categories, "\n");
      console.log("Mechanics", this.Mechanics, "\n");

      return "";
  }
}
