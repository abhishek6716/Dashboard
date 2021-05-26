const accessToken = localStorage.getItem('token')

if (!accessToken) {
    window.location = window.location.href.split('/table.html')[0] + '/index.html'
}

let candidatesData;

const getCandidates = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://api-hfc.techchefz.com/icicihfc-micro-service/rms/dashboard/get/all/candidates/?pageSize=10000", requestOptions)

        if (response.status === 200) {
            const datum = await response.json()
            console.log(datum)
            candidatesData = datum.data
            repaginate()
        } else {
            throw new Error('Unable to fetch data!')
        }

    } catch (error) {
        console.log(error.message)

    }

}

getCandidates()

const getRow = (cnt, name, role, dep, loc, cDate, uDate, luDate, status, id, remarks, luplDate) => {
    return ` 
			<tr>
                <td>${cnt}.</td>
                <td>${name}</td>
				<td>${role}</td>
				<td>${dep}</td>
				<td>${loc}</td>
                <td>${cDate}</td>
                <td>${uDate}</td>
                <td>${luDate}</td>
                <td>${status}</td>
                <td>${id}</td>
                <td>${remarks}</td>
                <td>${luplDate}</td>
			</tr>
			`;
};

const drawTable = (candidates, pageNumber, pageSize) => {
    $("tbody").html("")
    candidates.forEach((candidate, idx) => {
        $('tbody').append(
            getRow(
                (pageNumber - 1) * pageSize + idx + 1,
                candidate.fullName,
                candidate.role.name,
                candidate.role.department.name,
                candidate.jobLocation,
                candidate.createdDate,
                candidate.updatedDate,
                candidate.lastUpdatedBy,
                candidate.candidateStatus,
                candidate.candidateId,
                candidate.remarks,
                candidate.lastUploadDate
            )
        );
    })
}

const repaginate = () => {
    const pageSize = $('#pageSize').val()
    if (pageSize >= 1 && pageSize <= candidatesData.length) {
        $('#pagination').pagination({
            dataSource: candidatesData,
            pageSize,
            callback: function (data, pagination) {
                drawTable(data, pagination.pageNumber, pagination.pageSize)
            },
        });
    } else {
        alert('Enter valid page size!')
    }
}
