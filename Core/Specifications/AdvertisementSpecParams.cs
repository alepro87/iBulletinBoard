namespace Core.Specifications;

public class AdvertisementSpecParams
{
    private const int MaxPageSize = 50;
    public int PageIndex { get; set; } = 1;

    private int _pageSize = 6;
    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
    }


    private List<string> m_Categories = [];
    public List<string> Categories
    {
        get => m_Categories;
        set
        {
            m_Categories = value.SelectMany(x => x.Split(',',
                StringSplitOptions.RemoveEmptyEntries)).ToList();
        }
    }
    private List<string> m_Locations = [];
    public List<string> Locations
    {
        get => m_Locations;
        set
        {
            m_Locations = value.SelectMany(x => x.Split(',',
                StringSplitOptions.RemoveEmptyEntries)).ToList();
        }
    }

    public string? Sort { get; set; }

    private string? m_Search;
    public string Search
    {
        get => m_Search ?? "";
        set => m_Search = value.ToLower();
    }

}
